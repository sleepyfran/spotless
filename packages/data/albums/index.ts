import { Database, fieldNameOf } from "@spotless/data-db";
import { Api } from "@spotless/data-api";
import { Album } from "@spotless/types";
import { Single, singleFrom } from "@spotless/services-rx";
import { String } from "@spotless/services-utils";
import { Observable } from "rxjs";

/**
 * Exposes the queries that the app can fetch from the albums table.
 */
export class AlbumsData {
  constructor(private readonly db: Database, private readonly api: Api) {}

  /**
   * Returns the detail of a specific album.
   */
  public albumDetail(id: string): Single<Album | undefined> {
    return singleFrom(
      this.db.albums.where(fieldNameOf<Album>("id")).equals(id).first()
    );
  }

  /**
   * Returns all the albums in the user's library.
   */
  public allAlbumsByName(filter?: string): Observable<Album[]> {
    const normalizedFilter = String.normalizeForComparison(filter || "");

    return this.db.observe(() => {
      const query = this.db.albums.orderBy(fieldNameOf<Album>("artistName"));
      return normalizedFilter
        ? query
            .filter(
              (album) =>
                String.normalizeForComparison(album.artistName).includes(
                  normalizedFilter
                ) ||
                String.normalizeForComparison(album.name).includes(
                  normalizedFilter
                )
            )
            .toArray()
        : query.toArray();
    });
  }

  /**
   * Returns the first `n` albums in the user's library, ordered by the given
   * field. If not given, orders by the album's name by default.
   */
  public fetchN<K extends keyof Album>(
    n: number,
    orderBy?: K
  ): Observable<Album[]> {
    return this.db.observe(() =>
      this.db.albums
        .orderBy(fieldNameOf<Album>(orderBy || "name"))
        .reverse()
        .limit(n)
        .toArray()
    );
  }
}
