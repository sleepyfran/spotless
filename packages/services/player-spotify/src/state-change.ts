import { PlayerData } from "@spotless/data-player";
import { getVolume } from "./volume";
import { PlayerState, CurrentlyPlaying, Id, Queue } from "@spotless/types";
import { queueFromCurrentlyPlaying, shouldContinueFromQueue } from "./queue";
import { AlbumsData } from "@spotless/data-albums";
import { Single, singleFrom } from "@spotless/services-rx";
import { concatMap, forkJoin, map } from "rxjs";
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

type StateUpdateResponse =
  | {
      kind: "continueWithNewState";
      state: PlayerState;
    }
  | {
      kind: "replaceWithQueuePlayback";
      state: PlayerState;
      item: Id;
    };

const createPlayerStateFromSpotifyState = (
  previousState: PlayerState,
  updatedSpotifyState:
    | (Spotify.PlaybackState & { volume?: number; queue: Queue })
    | undefined
): StateUpdateResponse => {
  if (!updatedSpotifyState) {
    return {
      kind: "continueWithNewState",
      state: previousState,
    };
  }

  if (shouldContinueFromQueue(previousState, updatedSpotifyState)) {
    // If playback has finished and we have more stuff to play on our queue,
    // we keep the state as it is but replace the queue with the next item
    // and return a command to play it.
    const updatedQueue = previousState.queue.slice(1);

    return {
      kind: "replaceWithQueuePlayback",
      state: {
        ...previousState,
        queue: updatedQueue,
      },
      item: updatedQueue[0].id,
    };
  } else {
    // If we don't need to continue with our internal queue, update to the
    // new state as specified by the player and keep playback as it is.
    const currentlyPlaying = updatedSpotifyState.track_window?.current_track
      ? toCurrentlyPlaying(updatedSpotifyState.track_window.current_track)
      : undefined;

    return {
      kind: "continueWithNewState",
      state: {
        currentlyPlaying: currentlyPlaying,
        volume: updatedSpotifyState.volume ?? 50,
        queue: updatedSpotifyState.queue,
        paused: updatedSpotifyState.paused,
        shuffle: updatedSpotifyState.shuffle,
        positionInMs: updatedSpotifyState.position,
      },
    };
  }
};

type StateChangeDeps = {
  albumsData: AlbumsData;
  logger: Logger;
  player?: Spotify.Player;
  playerState: PlayerData;
};

const deriveState = (
  deps: StateChangeDeps,
  currentState: PlayerState,
  updatedSpotifyState: Spotify.PlaybackState
): Single<StateUpdateResponse> =>
  singleFrom(
    forkJoin({
      queue: queueFromCurrentlyPlaying(
        deps,
        currentState,
        toCurrentlyPlaying(updatedSpotifyState.track_window.current_track)
      ),
      volume: getVolume(deps),
    }).pipe(
      map(({ queue, volume }) =>
        createPlayerStateFromSpotifyState(currentState, {
          ...updatedSpotifyState,
          volume,
          queue,
        })
      )
    )
  );

/**
 * Computes the next player action to perform based on the current player state
 * and an updated Spotify state.
 */
export const getNextUpdateAction = (
  deps: StateChangeDeps,
  updatedSpotifyState: Spotify.PlaybackState
): Single<StateUpdateResponse> => {
  const { playerState } = deps;

  return singleFrom(
    playerState
      .state()
      .pipe(concatMap((state) => deriveState(deps, state, updatedSpotifyState)))
  );
};
