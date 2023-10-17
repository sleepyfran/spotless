import { Database, DataProvider, fieldNameOf } from "@spotless/data-db";
import { Api } from "@spotless/data-api";
import {
  Album,
  AlbumType,
  Artist,
  Genre,
  GroupedAlbums,
} from "@spotless/types";
import { Observable, map } from "rxjs";

/**
 * Exposes the queries that the app can fetch from the albums table.
 */
export class AlbumsData extends DataProvider<Album> {
  constructor(db: Database, private readonly api: Api) {
    super(db, db.albums, "artistName");
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
   * Returns all the albums in the user's library of a specific genre.
   */
  public allAlbumsOfGenre(genre: Genre): Observable<Album[]> {
    return this.db.observe(() =>
      this.db.albums
        .where(fieldNameOf<Album>("genres"))
        .equals(genre)
        .sortBy(fieldNameOf<Album>("artistName"))
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
}
