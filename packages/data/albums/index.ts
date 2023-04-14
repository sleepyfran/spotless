import { Database, fieldNameOf } from "@spotless/data-db";
import { Api } from "@spotless/data-api";
import { Album, AlbumDetail } from "@spotless/types";
import { Single } from "@spotless/services-rx";
import { Observable } from "rxjs";

/**
 * Exposes the queries that the app can fetch from the albums table.
 */
export class AlbumsData {
  constructor(private readonly db: Database, private readonly api: Api) {}

  /**
   * Returns the detail of a specific album.
   */
  public albumDetail(id: string): Single<AlbumDetail> {
    return this.api.album.get(id);
  }

  /**
   * Returns all the albums in the user's library.
   */
  public allAlbumsByName(): Observable<Album[]> {
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
