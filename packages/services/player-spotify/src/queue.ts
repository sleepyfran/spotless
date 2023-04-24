import { AlbumsData } from "@spotless/data-albums";
import { PlayerData } from "@spotless/data-player";
import { Single, singleOf } from "@spotless/services-rx";
import { Album, AlbumMappers, PlayerState, QueueItem } from "@spotless/types";
import { map } from "rxjs";

const filterOutPreviouslyPlayed = (
  queue: QueueItem[],
  currentlyPlaying: QueueItem
) => {
  const currentlyPlayingIndex = queue.findIndex(
    (item) => item.trackId === currentlyPlaying.trackId
  );

  // We couldn't find the current song. Strange, but let's keep the queue to
  // have something to show.
  if (currentlyPlayingIndex === -1) {
    return queue;
  }

  return queue.slice(currentlyPlayingIndex + 1);
};

type CurrentlyPlayingQueueDeps = {
  albumsData: AlbumsData;
};

/**
 * Updates the queue based on the currently playing track, which attempts to
 * filter out previously played tracks from the current queue or, if there's no
 * current queue, re-creates it from the currently playing album.
 */
export const queueFromCurrentlyPlaying = (
  { albumsData }: CurrentlyPlayingQueueDeps,
  currentState: PlayerState,
  currentlyPlaying: QueueItem
): Single<QueueItem[]> => {
  if (currentState.queue.length === 0) {
    // If the queue is empty, set it to the currently playing album.
    return albumsData.albumDetail(currentlyPlaying.albumId).pipe(
      map((album) => (album ? AlbumMappers.trackListToQueue(album) : [])),
      map((queue) => filterOutPreviouslyPlayed(queue, currentlyPlaying))
    );
  }

  return singleOf(
    filterOutPreviouslyPlayed(currentState.queue, currentlyPlaying)
  );
};

/**
 * Creates a queue for an album that just started playing, which basically removes
 * the first track from the album, since it's already playing.
 */
export const queueFromAlbumPlay = (player: PlayerData, album: Album) => {
  player.setQueue(AlbumMappers.trackListToQueue(album).slice(1));
};
