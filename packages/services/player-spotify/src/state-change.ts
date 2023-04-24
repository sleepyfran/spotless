import { PlayerData } from "@spotless/data-player";
import { getVolume } from "./volume";
import { PlayerState, QueueItem } from "@spotless/types";
import { queueFromCurrentlyPlaying } from "./queue";
import { AlbumsData } from "@spotless/data-albums";
import { singleOf } from "@spotless/services-rx";
import { concatMap, map } from "rxjs";
import { Logger } from "@spotless/services-logger";

const idFromUri = (uri: string) => uri.split(":").pop();

const toQueueItem = (track: Spotify.Track): QueueItem => ({
  albumName: track.album.name,
  albumId: idFromUri(track.album.uri) || "",
  artistName: track.artists[0].name,
  coverUrl: track.album.images[0].url,
  trackId: track.id || idFromUri(track.uri) || "",
  trackName: track.name,
  trackLength: track.duration_ms,
});

const createPlayerStateFromSpotifyState = (
  currentState: PlayerState,
  updatedSpotifyState:
    | (Spotify.PlaybackState & { volume?: number; queue: QueueItem[] })
    | undefined
): PlayerState => {
  if (!updatedSpotifyState) {
    return currentState;
  }

  const currentlyPlaying = updatedSpotifyState.track_window?.current_track
    ? toQueueItem(updatedSpotifyState.track_window.current_track)
    : undefined;

  return {
    currentlyPlaying: currentlyPlaying,
    volume: updatedSpotifyState.volume ?? 50,
    queue: updatedSpotifyState.queue,
    paused: updatedSpotifyState.paused,
    shuffle: updatedSpotifyState.shuffle,
    positionInMs: updatedSpotifyState.position,
  };
};

type StateChangeDeps = {
  albumsData: AlbumsData;
  logger: Logger;
  player?: Spotify.Player;
  playerState: PlayerData;
};

const queueFromSpotifyUpdate = (
  { albumsData, logger }: StateChangeDeps,
  playerState: PlayerState,
  updatedSpotifyState: Spotify.PlaybackState
) => {
  if (updatedSpotifyState.track_window.current_track) {
    logger.log("Updating queue based on current track");
    return queueFromCurrentlyPlaying(
      { albumsData },
      playerState,
      toQueueItem(updatedSpotifyState.track_window.current_track)
    );
  }

  logger.log("No current track, returning empty queue");
  return singleOf([]);
};

/**
 * Updates the player state given a new Spotify player state. This unifies
 * the queue of the app with the current playback state of the Spotify player
 * and updates the volume as well.
 */
export const updateState = (
  deps: StateChangeDeps,
  updatedSpotifyState: Spotify.PlaybackState
) => {
  const { player, playerState } = deps;

  return playerState.mapStateAsync((state) => {
    return queueFromSpotifyUpdate(deps, state, updatedSpotifyState).pipe(
      concatMap((queue) => {
        return getVolume({ player }).pipe(
          map((volume) =>
            createPlayerStateFromSpotifyState(state, {
              ...updatedSpotifyState,
              volume,
              queue,
            })
          )
        );
      })
    );
  });
};
