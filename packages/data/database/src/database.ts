import Dexie, { Table, liveQuery } from "dexie";
import { Observable, from } from "rxjs";
import { Album, AuthenticatedUser } from "@spotless/types";

/**
 * Wrapper around Dexie that provides a way of interacting with the database.
 */
export class Database extends Dexie {
  auth!: Table<AuthenticatedUser>;
  albums!: Table<Album>;

  constructor() {
    super("spotless");
    this.version(1).stores({
      auth: ", accessToken, refreshToken, tokenType, scope, expirationTimestamp",
      albums: "id, name, artistName, coverUrl",
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
