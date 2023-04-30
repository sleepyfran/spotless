import { PlayerData } from "@spotless/data-player";
import { getVolume } from "./volume";
import { PlayerState, QueuedAlbum, CurrentlyPlaying } from "@spotless/types";
import { queueFromCurrentlyPlaying } from "./queue";
import { AlbumsData } from "@spotless/data-albums";
import { singleOf } from "@spotless/services-rx";
import { concatMap, map } from "rxjs";
import { Logger } from "@spotless/services-logger";

const idFromUri = (uri: string) => uri.split(":").pop();

const toCurrentlyPlaying = (track: Spotify.Track): CurrentlyPlaying => ({
  id: idFromUri(track.uri) || "",
  name: track.name,
  lengthInMs: track.duration_ms,
  album: {
    id: idFromUri(track.album.uri) || "",
    name: track.album.name,
    artistName: track.artists[0].name,
    coverUrl: track.album.images[0].url,
    played: false,
  },
  played: false,
});

const createPlayerStateFromSpotifyState = (
  currentState: PlayerState,
  updatedSpotifyState:
    | (Spotify.PlaybackState & { volume?: number; queue: QueuedAlbum[] })
    | undefined
): PlayerState => {
  if (!updatedSpotifyState) {
    return currentState;
  }

  const currentlyPlaying = updatedSpotifyState.track_window?.current_track
    ? toCurrentlyPlaying(updatedSpotifyState.track_window.current_track)
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
      toCurrentlyPlaying(updatedSpotifyState.track_window.current_track)
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
