import { Playable } from "@spotless/types";
import { Single } from "@spotless/services-rx";

export interface Player {
  /**
   * Plays the given album and resumes the playback.
   */
  play(item: Playable): Single<void>;

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
   * Sets the shuffle to the given value.
   * @param state The state to set the shuffle to.
   */
  setShuffle(state: boolean): Single<void>;

  /**
   * Sets the volume of the player. If the player is not currently connected,
   * does nothing.
   * @param volume The volume to set, between 0 and 100.
   */
  setVolume(volume: number): Single<void>;
}
