import { Database, fieldNameOf } from "@spotless/data-db";
import { Artist } from "@spotless/types";

/**
 * Exposes the queries that the app can fetch from the artists table.
 */
export class ArtistsData {
  constructor(readonly db: Database) {}

  /**
   * Returns all the artists in the user's library.
   */
  public allArtistsByName(): Promise<Artist[]> {
    return this.db.artists.orderBy(fieldNameOf<Artist>("name")).toArray();
  }

  /**
   * Returns the first n records in the artists table.
   */
  public fetchN(n: number): Promise<Artist[]> {
    return this.db.artists.limit(n).toArray();
  }
}
