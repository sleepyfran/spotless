import { AlbumsData } from "@spotless/data-albums";
import { Single, singleOf } from "@spotless/services-rx";
import {
  AlbumMappers,
  CurrentlyPlaying,
  Id,
  PlayerState,
  Queue,
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
  queue: Queue,
  currentlyPlaying: CurrentlyPlaying
) =>
  queue.map((queuedAlbum) => {
    if (queuedAlbum.id === currentlyPlaying.album.id) {
      return {
        ...queuedAlbum,
        trackList: markPreviouslyPlayedTracks(
          queuedAlbum.trackList,
          currentlyPlaying
        ),
      };
    }

    return queuedAlbum;
  });

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
): Single<Queue> => {
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

/**
 * Computes whether we should override the queue with the app's integrated one
 * based on whether we have more items other than the current one and whether
 * Spotify is paused and in the beginning of the playback.
 *
 * This can result in a false positive if the user pauses and sets the playback
 * to position 0, but I don't want to play nicely with Spotify connect for now :^)
 */
export const shouldContinueFromQueue = (
  currentState: PlayerState,
  updatedSpotifyState: Spotify.PlaybackState
) =>
  currentState.queue.length > 1 &&
  currentState.currentlyPlaying?.id ===
    updatedSpotifyState.track_window.current_track.id &&
  updatedSpotifyState.paused &&
  updatedSpotifyState.position === 0;
