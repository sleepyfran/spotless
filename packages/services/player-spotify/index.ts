import { AuthData } from "@spotless/data-auth";
import { Player } from "@spotless/services-player";
import { PlayerData } from "@spotless/data-player";
import { Logger, LoggerFactory } from "@spotless/services-logger";
import { Api } from "@spotless/data-api";
import { Album, AlbumMappers, AuthenticatedUser, Id } from "@spotless/types";
import { Single, singleFrom, singleOf } from "@spotless/services-rx";
import {
  EMPTY,
  concatMap,
  distinctUntilChanged,
  fromEvent,
  ignoreElements,
  tap,
} from "rxjs";
import {
  ConnectionStatus,
  connected,
  disconnected,
  errored,
} from "./src/types";
import { transfer } from "./src/playback";
import { loadSpotifyPlaybackLib } from "./src/lib";
import { getNextUpdateAction } from "./src/state-change";
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

  public play(item: Id, overrideQueue = true): Single<void> {
    return this.api.player.play(item).pipe(
      concatMap(() => this.executePlayerAction((player) => player.resume())),
      concatMap(() =>
        queueFromAlbumPlay({ albumsData: this.albumsData }, item)
      ),
      tap((queue) => {
        if (overrideQueue) {
          this.playerState.setQueue(queue);
        }
      }),
      ignoreElements()
    );
  }

  public togglePlayback(): Single<void> {
    return this.executePlayerAction((player) => player.togglePlay());
  }

  public enqueue(item: Album): Single<void> {
    this.playerState.addToQueue(AlbumMappers.albumToQueuedAlbum(item));
    return EMPTY;
  }

  public emptyQueue(): Single<void> {
    this.playerState.setQueue([]);
    return EMPTY;
  }

  public shuffleAlbums(items: Album[]): Single<void> {
    return shuffleAlbums(
      { playerState: this.playerState, play: (item) => this.play(item.id) },
      items
    );
  }

  public setShuffle(state: boolean): Single<void> {
    return this.api.player.setShuffle(state);
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

    fromEvent(
      this.player,
      "player_state_changed",
      (event) => event as Spotify.PlaybackState
    )
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev.paused === curr.paused &&
            prev.track_window.current_track.id ===
              curr.track_window.current_track.id
        ),
        tap((state) => this.logger.log("Playback state changed", state)),
        concatMap((updatedSpotifyState) =>
          getNextUpdateAction(
            {
              albumsData: this.albumsData,
              logger: this.logger,
              player: this.player,
              playerState: this.playerState,
            },
            updatedSpotifyState
          )
        ),
        concatMap((action) => {
          this.logger.log("New action received", action);
          this.playerState.setState(action.state);

          switch (action.kind) {
            case "continueWithNewState":
              return EMPTY;
            case "replaceWithQueuePlayback":
              return this.play(action.item, false);
          }
        })
      )
      .subscribe({
        next: () => this.logger.log("Update emitted"),
        complete: () => this.logger.warn("Stream completed, somehow"),
      });

    return singleFrom(this.player.connect());
  }

  private disconnectPlayer(): Single<boolean> {
    this.player?.disconnect();
    return singleOf(true);
  }
}
