import { Album, Artist, Id } from "@spotless/types";
import { Single } from "@spotless/services-rx";

export enum PlayArtistDiscographyMode {
  FromNewest,
  FromOldest,
  Shuffled,
}

export interface Player {
  /**
   * Plays the given album and resumes the playback.
   */
  play(id: Id): Single<void>;

  /**
   * Plays the given set of albums and resumes playback.
   */
  playMultiple(items: Album[]): Single<void>;

  /**
   * Skips to the next track in the queue, if any. If there is no next track,
   * does nothing.
   */
  skip(): Single<void>;

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
   * Plays the discography of the given artist sorted by either newest or oldest.
   */
  playArtistDiscography(
    artist: Artist,
    mode: PlayArtistDiscographyMode
  ): Single<void>;

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
