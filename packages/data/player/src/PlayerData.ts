import { PlayerState, Queue, QueuedAlbum } from "@spotless/types";
import { BehaviorSubject } from "rxjs";

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
   * Changes the current state by applying the given map function over the
   * current state.
   */
  public mapState(map: (state: PlayerState) => Partial<PlayerState>) {
    this.playerState.next({
      ...this.playerState.getValue(),
      ...map(this.playerState.getValue()),
    });
  }

  /**
   * Sets the currently playing queue to the given value.
   */
  public setQueue(items: Queue) {
    this.patchState({
      queue: items,
    });
  }

  /**
   * Adds the given albums to the end of the queue.
   */
  public addToQueue(items: QueuedAlbum | Queue) {
    this.patchState({
      queue: [
        ...this.playerState.getValue().queue,
        ...(Array.isArray(items) ? items : [items]),
      ],
    });
  }
}
