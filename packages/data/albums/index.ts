import { Database, fieldNameOf } from "@spotless/data-db";
import { Album, Single } from "@spotless/types";

/**
 * Exposes the queries that the app can fetch from the albums table.
 */
export class AlbumsData {
  constructor(private readonly db: Database) {}

  /**
   * Returns all the albums in the user's library.
   */
  public allAlbumsByName(): Single<Album[]> {
    return this.db.observe(() =>
      this.db.albums.orderBy(fieldNameOf<Album>("artistName")).toArray()
    );
  }

  /**
   * Returns the first `n` albums in the user's library, ordered by the given
   * field. If not given, orders by the album's name by default.
   */
  public fetchN<K extends keyof Album>(
    n: number,
    orderBy?: K
  ): Single<Album[]> {
    return this.db.observe(() =>
      this.db.albums
        .orderBy(fieldNameOf<Album>(orderBy || "name"))
        .reverse()
        .limit(n)
        .toArray()
    );
  }
}
