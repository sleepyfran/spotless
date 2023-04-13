import { Album, Single } from "@spotless/types";

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
}
