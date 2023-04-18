import { AuthData } from "@spotless/data-auth";
import { Player } from "@spotless/services-player";
import { INITIAL_PLAYER_STATE, PlayerData } from "@spotless/data-player";
import { Logger, LoggerFactory } from "@spotless/services-logger";
import { Api } from "@spotless/data-api";
import { Album, AuthenticatedUser, PlayerState } from "@spotless/types";
import { Single, singleFrom, singleOf } from "@spotless/services-rx";
import { EMPTY, switchMap, concatMap, ignoreElements } from "rxjs";

type ConnectedPlayer = {
  __status: "connected";
  deviceId: string;
};

type DisconnectedPlayer = {
  __status: "disconnected";
};

type ErroredPlayer = {
  __status: "errored";
};

const connected = (deviceId: string): ConnectedPlayer => ({
  __status: "connected",
  deviceId,
});
const disconnected: DisconnectedPlayer = { __status: "disconnected" };
const errored: ErroredPlayer = { __status: "errored" };

type ConnectionStatus = ConnectedPlayer | DisconnectedPlayer | ErroredPlayer;

const toPlayerState = (
  state: (Spotify.PlaybackState & { volume?: number }) | undefined
): PlayerState =>
  state
    ? {
        currentlyPlaying: state?.track_window?.current_track
          ? {
              albumName: state.track_window.current_track.album.name,
              artistName: state.track_window.current_track.artists[0].name,
              coverUrl: state.track_window.current_track.album.images[0].url,
              trackName: state.track_window.current_track.name,
              trackLength: state.track_window.current_track.duration_ms,
            }
          : undefined,
        queue:
          state?.track_window?.next_tracks?.map((track) => ({
            albumName: track.album.name,
            artistName: track.artists[0].name,
            coverUrl: track.album.images[0].url,
            trackLength: track.duration_ms,
            trackName: track.name,
          })) ?? [],
        volume: state.volume ?? 50,
        paused: state.paused,
        shuffle: state.shuffle,
        positionInMs: state.position,
      }
    : INITIAL_PLAYER_STATE;

/**
 * Service dealing with the playback part of Spotify. Connects with the Playback
 * SDK and wraps a Spotify player to make it easier to interact with it.
 */
export class SpotifyPlayer implements Player {
  private player?: Spotify.Player;
  private logger: Logger;
  private status: ConnectionStatus = disconnected;

  constructor(
    auth: AuthData,
    private readonly playerState: PlayerData,
    private readonly api: Api,
    createLogger: LoggerFactory
  ) {
    this.logger = createLogger("SpotifyPlayer");

    this.loadLib();
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.logger.log("Spotify SDK ready");

      // Sync the player with the auth state.
      auth.authenticatedUser().subscribe({
        next: (auth) => {
          if (auth) {
            this.initializePlayer(auth);
          } else {
            this.disconnectPlayer();
          }
        },
      });
    };
  }

  private loadLib() {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onload = () => this.logger.log("Spotify SDK loaded");
    script.onerror = () => {
      this.logger.error("Spotify SDK failed to load");
      this.status = errored;
    };
    document.body.appendChild(script);
  }

  private get isConnected() {
    return this.status.__status === "connected";
  }

  public play(item: Album): Single<void> {
    return this.api.player.play(item).pipe(switchMap(() => this.resume()));
  }

  public resume(): Single<void> {
    return this.executePlayerAction((player) => player.resume());
  }

  public setShuffle(state: boolean): Single<void> {
    return this.api.player.setShuffle(state);
  }

  public pause(): Single<void> {
    return this.executePlayerAction((player) => player.pause());
  }

  public setVolume(volume: number): Single<void> {
    const normalizedVolume = volume / 100;
    return this.executePlayerAction((player) =>
      player.setVolume(normalizedVolume)
    );
  }

  public transferPlayback(force?: boolean): Single<void> {
    if (this.status.__status !== "connected") {
      return EMPTY;
    }

    const currentDeviceId = this.status.deviceId;
    const transferPlayback = this.api.client
      .put("/me/player", {
        device_ids: [currentDeviceId],
      })
      .pipe(ignoreElements());

    if (force) {
      return transferPlayback;
    }

    return this.api.client
      .get<SpotifyApi.CurrentPlaybackResponse>("/me/player")
      .pipe(
        concatMap((playbackState) => {
          const playingInAnotherDevice =
            playbackState.is_playing &&
            playbackState.device.id !== currentDeviceId;
          if (playingInAnotherDevice) {
            // We don't want to interrupt the playback in another device.
            this.logger.log(
              "User is playing in another device, skipping playback transfer"
            );
            return EMPTY;
          }

          this.logger.log("Transferring playback to current device");
          return transferPlayback;
        }),
        ignoreElements()
      );
  }

  private executePlayerAction(
    action: (player: Spotify.Player) => Promise<void>
  ): Single<void> {
    if (this.isConnected && this.player) {
      return singleFrom(action(this.player));
    }

    return EMPTY;
  }

  private initializePlayer(auth: AuthenticatedUser): Single<boolean> {
    this.logger.log("Initializing player");
    this.player = new window.Spotify.Player({
      name: "Spotless",
      getOAuthToken: (cb) => cb(auth.accessToken),
      volume: 1.0,
    });

    // Device is ready to stream.
    this.player.addListener(
      "ready",
      ({ device_id }: Spotify.WebPlaybackInstance) => {
        this.logger.log(
          `Ready with Device ID ${device_id}, transferring playback...`
        );
        this.status = connected(device_id);
        this.transferPlayback().subscribe();
      }
    );

    // Device got disconnected.
    this.player.addListener("not_ready", () => {
      this.logger.log("Device has gone offline");
      this.status = disconnected;
    });

    this.player.addListener("initialization_error", () => {
      this.logger.error("Failed to initialize");
      this.status = errored;
    });

    this.player.addListener("authentication_error", () => {
      this.logger.error("Failed to authenticate");
      this.status = errored;
    });

    this.player.addListener(
      "player_state_changed",
      (state: Spotify.PlaybackState) => {
        this.logger.log(
          "Playback state has changed. Attempting to retrieve volume before setting. State is:",
          state
        );

        if (!this.player) {
          this.logger.warn("Player has no value, defaulting to 50");
          this.playerState.setState(toPlayerState(state));
          return;
        }

        this.player
          .getVolume()
          .then((volume) => {
            const normalizedVolume = volume * 100;
            this.logger.log("Volume retrieved, setting to", normalizedVolume);
            this.playerState.setState(
              toPlayerState({ ...state, volume: normalizedVolume })
            );
          })
          .catch(() => {
            this.logger.error(
              "Failed to retrieve volume from player, defaulting to 50"
            );
            this.playerState.setState(toPlayerState(state));
          });
      }
    );

    return singleFrom(this.player.connect());
  }

  private disconnectPlayer(): Single<boolean> {
    this.player?.disconnect();
    return singleOf(true);
  }
}
