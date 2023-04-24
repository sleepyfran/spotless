import { Album, QueueItem } from "../index";

/**
 * Returns the given album's track list as a queue.
 */
export const trackListToQueue = (album: Album): QueueItem[] =>
  album.trackList.map((track) => ({
    albumId: album.id,
    albumName: album.name,
    artistName: album.artistName,
    coverUrl: album.coverUrl,
    trackId: track.id,
    trackName: track.name,
    trackLength: track.lengthInMs,
  }));
