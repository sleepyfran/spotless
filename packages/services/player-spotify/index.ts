import { AuthData } from "@spotless/data-auth";
import { Player } from "@spotless/services-player";
import { Api } from "@spotless/data-api";
import { Album, AuthenticatedUser, Single } from "@spotless/types";
import { from, Observable, of, EMPTY, switchMap } from "rxjs";

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

/**
 * Service dealing with the playback part of Spotify. Connects with the Playback
 * SDK and wraps a Spotify player to make it easier to interact with it.
 */
export class SpotifyPlayer implements Player {
  private player?: Spotify.Player;
  private status: ConnectionStatus = disconnected;

  constructor(auth: AuthData, private readonly api: Api) {
    window.onSpotifyWebPlaybackSDKReady = () => {
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

  public play(item: Album): Single<void> {
    return this.api.player.play(item).pipe(switchMap(() => this.resume()));
  }

  public resume(): Single<void> {
    return this.executePlayerAction((player) => player.resume());
  }

  public pause(): Single<void> {
    return this.executePlayerAction((player) => player.pause());
  }

  private executePlayerAction(
    action: (player: Spotify.Player) => Promise<void>
  ): Single<void> {
    if (this.isConnected && this.player) {
      return from(action(this.player));
    }

    return EMPTY;
  }

  private initializePlayer(auth: AuthenticatedUser): Observable<boolean> {
    this.player = new window.Spotify.Player({
      name: "Spotless",
      getOAuthToken: (cb) => cb(auth.accessToken),
      volume: 1.0,
    });

    // Device is ready to stream.
    this.player.addListener(
      "ready",
      ({ device_id }: Spotify.WebPlaybackInstance) => {
        console.log("Ready with Device ID", device_id);
        this.status = connected(device_id);
      }
    );

    // Device got disconnected.
    this.player.addListener("not_ready", () => {
      console.log("Device has gone offline");
      this.status = disconnected;
    });

    this.player.addListener("initialization_error", () => {
      console.log("Failed to initialize");
      this.status = errored;
    });

    this.player.addListener("authentication_error", () => {
      console.log("Failed to authenticate");
      this.status = errored;
    });

    return from(this.player.connect());
  }

  private disconnectPlayer(): Observable<boolean> {
    this.player?.disconnect();
    return of(true);
  }
}
