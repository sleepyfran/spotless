import { Database, fieldNameOf } from "@spotless/data-db";
import { Artist } from "@spotless/types";
import { Single } from "@spotless/services-rx";

/**
 * Exposes the queries that the app can fetch from the artists table.
 */
export class ArtistsData {
  constructor(readonly db: Database) {}

  /**
   * Returns all the artists in the user's library.
   */
  public allArtistsByName(): Single<Artist[]> {
    return this.db.observe(() =>
      this.db.artists.orderBy(fieldNameOf<Artist>("name")).toArray()
    );
  }

  /**
   * Returns the first n records in the artists table.
   */
  public fetchN(n: number): Single<Artist[]> {
    return this.db.observe(() => this.db.artists.limit(n).toArray());
  }
}
