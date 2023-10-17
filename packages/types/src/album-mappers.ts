import { Album, QueuedAlbum } from "../index";

/**
 * Returns the queued version of the given album.
 */
export const albumToQueuedAlbum = (album: Album): QueuedAlbum => ({
  ...album,
  played: false,
  trackList: album.trackList.map((track) => ({
    ...track,
    albumId: album.id,
    played: false,
  })),
});
