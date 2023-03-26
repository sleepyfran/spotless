import { AppState } from "@spotless/core-state";
import { from, Observable, of } from "rxjs";
import { concatMap, tap } from "rxjs/operators";

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
export class PlayerService {
  private player?: Spotify.Player;
  private status: ConnectionStatus = disconnected;

  constructor(readonly appState: AppState) {
    window.onSpotifyWebPlaybackSDKReady = () => {
      // Set the status of the player based on the auth state.
      appState
        .observe("auth")
        .pipe(
          concatMap((auth) => {
            if (auth.__status === "authenticated") {
              return this.initializePlayer(auth.accessToken);
            } else {
              return this.disconnectPlayer();
            }
          })
        )
        .subscribe();
    };
  }

  private get isConnected() {
    return this.status.__status === "connected";
  }

  /**
   * Resumes the playback of the current track, if any. If the player is not
   * currently connected, does nothing.
   */
  public resume() {
    this.executePlayerAction(() => this.player?.resume());
  }

  /**
   * Pauses the playback of the current track, if any. If the player is not
   * currently connected, does nothing.
   */
  public pause() {
    this.executePlayerAction(() => this.player?.pause());
  }

  private executePlayerAction(action: () => Promise<void> | undefined) {
    if (this.isConnected && action) {
      action();
    }
  }

  private initializePlayer = (token: string): Observable<boolean> => {
    this.player = new window.Spotify.Player({
      name: "Spotless",
      getOAuthToken: (cb: any) => cb(token),
      volume: 1.0,
    });

    // Device is ready to stream.
    this.player.addListener("ready", ({ device_id }: any) => {
      console.log("Ready with Device ID", device_id);
      this.status = connected(device_id);
    });

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
  };

  private disconnectPlayer(): Observable<boolean> {
    this.player?.disconnect();
    return of(true);
  }
}
