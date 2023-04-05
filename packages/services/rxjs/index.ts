import { Observable, lastValueFrom, toArray } from "rxjs";

/**
 * Collects all the values emitted by the source observable into a promise that
 * resolves an array of all these values.
 */
export const collectIntoArray = <T>(source: Observable<T>): Promise<T[]> =>
  lastValueFrom(source.pipe(toArray()));
