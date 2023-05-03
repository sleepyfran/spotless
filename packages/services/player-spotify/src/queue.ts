import { AlbumsData } from "@spotless/data-albums";
import { Single, singleOf } from "@spotless/services-rx";
import {
  AlbumMappers,
  CurrentlyPlaying,
  Id,
  PlayerState,
  QueuedAlbum,
  QueuedAlbumTrack,
} from "@spotless/types";
import { map } from "rxjs";

const markPreviouslyPlayedTracks = (
  tracks: QueuedAlbumTrack[],
  currentlyPlaying: CurrentlyPlaying
) => {
  const currentlyPlayingTrackIndex = tracks.findIndex(
    (track) => track.id === currentlyPlaying.id
  );

  return tracks.map((track, index) => ({
    ...track,
    played: index < currentlyPlayingTrackIndex,
  }));
};

const markPreviouslyPlayed = (
  queue: QueuedAlbum[],
  currentlyPlaying: CurrentlyPlaying
) => {
  const currentlyPlayingAlbumIndex = queue.findIndex(
    (album) => album.id === currentlyPlaying.album.id
  );

  // Set all albums before the currently playing one to played.
  const albumsPlayedSoFar = queue
    .slice(0, currentlyPlayingAlbumIndex)
    .map((album) => ({
      ...album,
      played: true,
    }));

  // Mark all tracks before the currently playing one as played.
  const currentAlbum: QueuedAlbum = {
    ...queue[currentlyPlayingAlbumIndex],
    trackList: markPreviouslyPlayedTracks(
      queue[currentlyPlayingAlbumIndex].trackList,
      currentlyPlaying
    ),
  };

  const restOfAlbums = queue.slice(currentlyPlayingAlbumIndex + 1);

  return [...albumsPlayedSoFar, currentAlbum, ...restOfAlbums];
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
  currentlyPlaying: CurrentlyPlaying
): Single<QueuedAlbum[]> => {
  // If there's no queue, create one from the currently playing album.
  const updatedQueue =
    currentState.queue.length === 0
      ? albumsData
          .albumDetail(currentlyPlaying.album.id)
          .pipe(
            map((album) =>
              album ? [AlbumMappers.albumToQueuedAlbum(album)] : []
            )
          )
      : singleOf(currentState.queue);

  return updatedQueue.pipe(
    map((queue) => markPreviouslyPlayed(queue, currentlyPlaying))
  );
};

/**
 * Returns a queue that contains only the given album.
 */
export const queueFromAlbumPlay = (
  { albumsData }: CurrentlyPlayingQueueDeps,
  albumId: Id
) => {
  return albumsData
    .albumDetail(albumId)
    .pipe(
      map((album) => (album ? [AlbumMappers.albumToQueuedAlbum(album)] : []))
    );
};
