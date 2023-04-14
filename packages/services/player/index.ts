import { Album } from "@spotless/types";
import { Single } from "@spotless/services-rx";

export interface Player {
  /**
   * Plays the given album and resumes the playback.
   */
  play(item: Album): Single<void>;

  /**
   * Resumes the playback of the current track, if any. If the player is not
   * currently connected, does nothing.
   */
  resume(): Single<void>;

  /**
   * Pauses the playback of the current track, if any. If the player is not
   * currently connected, does nothing.
   */
  pause(): Single<void>;

  /**
   * Transfers the playback to the current device.
   * TODO: This is specific to Spotify and shouldn't be here.
   */
  transferPlayback(): Single<void>;
}
