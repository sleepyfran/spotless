import Dexie, { Table, liveQuery } from "dexie";
import { Observable, from } from "rxjs";
import {
  Album,
  Artist,
  AuthenticatedUser,
  IndexedGenre,
} from "@spotless/types";

/**
 * Defines the options that can be passed to the fetch methods.
 */
export type FetchOptions<T> = {
  limit?: number;
  orderBy?: keyof T;
};

/**
 * Wrapper around Dexie that provides a way of interacting with the database.
 */
export class Database extends Dexie {
  auth!: Table<AuthenticatedUser>;
  albums!: Table<Album>;
  artists!: Table<Artist>;
  genres!: Table<IndexedGenre>;

  constructor() {
    super("spotless");
    this.version(1).stores({
      auth: ", accessToken, refreshToken",
      albums: "id, artistName, artistId, addedAt, *genres",
      artists: "id, name",
      genres: "++id, &name",
    });
  }

  /**
   * Starts a live query that will emit the result of the given querier every time
   * the table updates.
   * @param querier function that queries the database.
   */
  public observe<T>(querier: () => T | Promise<T>): Observable<T> {
    return from(liveQuery(querier));
  }
}
