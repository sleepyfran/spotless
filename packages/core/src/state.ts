import {
  BehaviorSubject,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
} from "rxjs";
import { IStorage } from "./storage/storage.interface";

import { State } from "./types/state.types";

const initialState: State = {
  auth: {
    __status: "unauthenticated",
  },
};

const STATE_STORAGE_KEY = "state";

/**
 * Holds the current app state as a behavior subject from RxJS that can be
 * subscribed to from the UI layer. This subject is then populated by various
 * events raised by services inside the core.
 *
 * This initial state is taken from the given persistent storage method, if
 * any, otherwise it defaults to the true initial state of the app. On every
 * update, it dumps the complete state to the persistent storage.
 */
export class AppState {
  private state$: BehaviorSubject<State>;

  constructor(readonly persistentStorage: IStorage) {
    const initialValue = this.tryRetrieveFromStorage();
    this.state$ = new BehaviorSubject(initialValue);
  }

  /**
   * Retrieves the inner state that is currently set in the subject. Prefer
   * subscribing via the exposed method since this will not trigger in case of
   * updates to the subject.
   */
  public get state(): State {
    return this.state$.getValue();
  }

  /**
   * Returns an observable that triggers when a specific portion of the state
   * changes.
   * @param path key of the state to observe.
   */
  public observe<K extends keyof State>(path: K): Observable<State[K]> {
    return this.state$.pipe(
      startWith(initialState),

      // Retrieve the specific part of the state.
      map((state) => state[path]),

      // Do not retrigger unless it changes.
      distinctUntilChanged()
    );
  }

  /**
   * Updates a specific portion of the state with the given value.
   * @param path key of the state to update.
   * @param value value to set the key to.
   */
  public patch<K extends keyof State, T extends State[K]>(path: K, value: T) {
    this.state$.next({
      ...this.state$.getValue(),
      [path]: value,
    });

    this.dumpStateToStorage();
  }

  private tryRetrieveFromStorage(): State {
    return (
      this.persistentStorage.retrieve<State>(STATE_STORAGE_KEY) || initialState
    );
  }

  private dumpStateToStorage() {
    // TODO: Profile this once the state grows to determine if updates should be batched.
    this.persistentStorage.save(STATE_STORAGE_KEY, this.state);
  }
}
