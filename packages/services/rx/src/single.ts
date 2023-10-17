import { Observable, first, from, of } from "rxjs";
import { ObservableInput, ObservedValueOf } from "rxjs/internal/types";

/**
 * Represents an observable that emits a single value and then completes.
 */
export type Single<T> = Observable<T>;

/**
 * Creates an observable that emits a single value and then completes.
 */
export const singleOf = <T>(value: T): Single<T> => of(value).pipe(first());

/**
 * Creates an observable from the given observable that emits a single value
 * and then completes.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const singleFrom = <O extends ObservableInput<any>>(
  input: O
): Single<ObservedValueOf<O>> => from(input).pipe(first());

export const test = (): Single<void> => of(undefined);
