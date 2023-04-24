import { AuthData } from "@spotless/data-auth";
import { Player } from "@spotless/services-player";
import { PlayerData } from "@spotless/data-player";
import { Logger, LoggerFactory } from "@spotless/services-logger";
import { Api } from "@spotless/data-api";
import {
  Album,
  AlbumMappers,
  AuthenticatedUser,
  Playable,
} from "@spotless/types";
import { Single, singleFrom, singleOf } from "@spotless/services-rx";
import { EMPTY, switchMap, tap } from "rxjs";
import {
  ConnectionStatus,
  connected,
  disconnected,
  errored,
} from "./src/types";
import { transfer } from "./src/playback";
import { loadSpotifyPlaybackLib } from "./src/lib";
import { updateState } from "./src/state-change";
import { queueFromAlbumPlay } from "./src/queue";
import { AlbumsData } from "@spotless/data-albums";
import { shuffleAlbums } from "./src/shuffle";

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
    private readonly albumsData: AlbumsData,
    private readonly playerState: PlayerData,
    private readonly api: Api,
    createLogger: LoggerFactory
  ) {
    this.logger = createLogger("SpotifyPlayer");

    loadSpotifyPlaybackLib({ logger: this.logger });
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

  private get isConnected() {
    return this.status.__status === "connected";
  }

  public play(item: Playable): Single<void> {
    return this.api.player.play(item).pipe(
      switchMap(() => this.resume()),
      tap(() => queueFromAlbumPlay(this.playerState, item))
    );
  }

  public resume(): Single<void> {
    return this.executePlayerAction((player) => player.resume());
  }

  public enqueue(item: Album): Single<void> {
    this.playerState.addToQueue(AlbumMappers.trackListToQueue(item));
    return EMPTY;
  }

  public shuffleAlbums(items: Album[]): Single<void> {
    return shuffleAlbums(
      { playerState: this.playerState, play: (item) => this.play(item) },
      items
    );
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
    return transfer(
      {
        api: this.api,
        connectionStatus: this.status,
        logger: this.logger,
      },
      force
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
      (updatedSpotifyState: Spotify.PlaybackState) => {
        this.logger.log("Playback state has changed to:", updatedSpotifyState);
        updateState(
          {
            albumsData: this.albumsData,
            logger: this.logger,
            player: this.player,
            playerState: this.playerState,
          },
          updatedSpotifyState
        ).subscribe();
      }
    );

    return singleFrom(this.player.connect());
  }

  private disconnectPlayer(): Single<boolean> {
    this.player?.disconnect();
    return singleOf(true);
  }
}
