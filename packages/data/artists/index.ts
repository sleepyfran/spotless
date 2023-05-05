import { Database, fieldNameOf } from "@spotless/data-db";
import { Artist, Id } from "@spotless/types";
import { Single, singleFrom } from "@spotless/services-rx";
import { String } from "@spotless/services-utils";

/**
 * Exposes the queries that the app can fetch from the artists table.
 */
export class ArtistsData {
  constructor(readonly db: Database) {}

  /**
   * Returns the artist with the given ID.
   */
  public byId(id: Id): Single<Artist | undefined> {
    return singleFrom(
      this.db.artists.where(fieldNameOf<Artist>("id")).equals(id).first()
    );
  }

  /**
   * Returns all the artists in the user's library.
   */
  public allArtistsByName(filter?: string): Single<Artist[]> {
    const normalizedFilter = String.normalizeForComparison(filter || "");

    return this.db.observe(() => {
      const query = this.db.artists.orderBy(fieldNameOf<Artist>("name"));

      return normalizedFilter
        ? query
            .filter((artist) =>
              String.normalizeForComparison(artist.name).includes(
                normalizedFilter
              )
            )
            .toArray()
        : query.toArray();
    });
  }

  /**
   * Returns the first n records in the artists table.
   */
  public fetchN(n: number): Single<Artist[]> {
    return this.db.observe(() => this.db.artists.limit(n).toArray());
  }
}
