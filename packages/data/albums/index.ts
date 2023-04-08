import { Database, fieldNameOf } from "@spotless/data-db";
import { Album } from "@spotless/types";

/**
 * Exposes the queries that the app can fetch from the albums table.
 */
export class AlbumsData {
  constructor(readonly db: Database) {}

  /**
   * Returns all the albums in the user's library.
   */
  public allAlbumsByName(): Promise<Album[]> {
    return this.db.albums.orderBy(fieldNameOf<Album>("artistName")).toArray();
  }

  /**
   * Returns the first n records in the albums table.
   */
  public fetchN(n: number): Promise<Album[]> {
    return this.db.albums.limit(n).toArray();
  }
}
