import { Database, FetchOptions, fieldNameOf } from "@spotless/data-db";
import { Api } from "@spotless/data-api";
import { Album, AlbumType, Artist, GroupedAlbums } from "@spotless/types";
import { Single, singleFrom } from "@spotless/services-rx";
import { String } from "@spotless/services-utils";
import { Observable, map } from "rxjs";

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
   * Returns all the albums in the user's library by a specific artist.
   */
  public allAlbumsByArtist(artist: Artist): Observable<Album[]> {
    return this.db.observe(() =>
      this.db.albums
        .where(fieldNameOf<Album>("artistId"))
        .equals(artist.id)
        .reverse()
        .sortBy(fieldNameOf<Album>("releaseDate"))
    );
  }

  /**
   * Returns all the albums in the user's library by a specific artist, grouped
   * by the album type.
   */
  public allGroupedAlbumsByArtist(artist: Artist): Observable<GroupedAlbums> {
    return this.allAlbumsByArtist(artist).pipe(
      map((albums) =>
        albums.reduce(
          (acc, album) => {
            acc[album.type].push(album);
            return acc;
          },
          {
            [AlbumType.Album]: [],
            [AlbumType.EP]: [],
            [AlbumType.Single]: [],
          } as GroupedAlbums
        )
      )
    );
  }

  /**
   * Returns the first `n` albums in the user's library, ordered by the given
   * field. If not given, orders by the album's name by default.
   */
  public fetch(opts: FetchOptions<Album>): Observable<Album[]> {
    return this.db.observe(() => {
      let query = this.db.albums
        .orderBy(fieldNameOf<Album>(opts.orderBy || "name"))
        .reverse();
      query = opts.limit ? query.limit(opts.limit) : query;
      return query.toArray();
    });
  }
}
