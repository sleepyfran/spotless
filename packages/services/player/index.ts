import { Album, Id } from "@spotless/types";
import { Single } from "@spotless/services-rx";

export interface Player {
  /**
   * Plays the given album and resumes the playback.
   */
  play(id: Id): Single<void>;

  /**
   * Resumes or pauses the playback of the current track, if any. If there is no
   * current track, does nothing.
   */
  togglePlayback(): Single<void>;

  /**
   * Adds the given album to the end of the queue.
   */
  enqueue(item: Album): Single<void>;

  /**
   * Removes all items from the queue, except for the one currently playing.
   */
  clearQueue(): Single<void>;

  /**
   * Shuffles the given albums playing each song in order inside of the album.
   */
  shuffleAlbums(items: Album[]): Single<void>;

  /**
   * Sets the volume of the player. If the player is not currently connected,
   * does nothing.
   * @param volume The volume to set, between 0 and 100.
   */
  setVolume(volume: number): Single<void>;
}
