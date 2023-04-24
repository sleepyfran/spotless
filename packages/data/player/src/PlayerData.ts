import {
  Playable,
  PlayerState,
  AlbumMappers,
  QueueItem,
} from "@spotless/types";
import { Single } from "@spotless/services-rx";
import { BehaviorSubject, ignoreElements, tap } from "rxjs";

export const INITIAL_PLAYER_STATE: PlayerState = {
  currentlyPlaying: undefined,
  queue: [],
  volume: 50,
  paused: true,
  shuffle: false,
  positionInMs: 0,
};

/**
 * Provides queries and mutations for the state of the player.
 */
export class PlayerData {
  private playerState = new BehaviorSubject<PlayerState>(INITIAL_PLAYER_STATE);

  /**
   * Returns an observable that emits the current player state and every time
   * it changes.
   */
  public state() {
    return this.playerState.asObservable();
  }

  /**
   * Applies an async mapping function to the current player state.
   */
  public mapStateAsync(map: (state: PlayerState) => Single<PlayerState>) {
    return map(this.playerState.getValue()).pipe(
      tap((state) => this.playerState.next(state)),
      ignoreElements()
    );
  }

  /**
   * Changes the current state to the given one.
   */
  public setState(state: PlayerState) {
    this.playerState.next(state);
  }

  /**
   * Changes the current state by applying the given patch.
   */
  public patchState(patch: Partial<PlayerState>) {
    this.playerState.next({
      ...this.playerState.getValue(),
      ...patch,
    });
  }

  /**
   * Sets the currently playing queue to the given value.
   */
  public setQueue(items: QueueItem[]) {
    this.patchState({
      queue: items,
    });
  }

  /**
   * Adds the given playable item to the end of the queue.
   */
  public addToQueue(item: Playable) {
    this.patchState({
      queue: [
        ...this.playerState.getValue().queue,
        ...AlbumMappers.trackListToQueue(item),
      ],
    });
  }
}
