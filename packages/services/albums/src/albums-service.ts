import { Api } from "@spotless/services-api";
import { SimpleAlbum } from "@spotless/types";
import { EMPTY, Observable, expand, map, mergeMap } from "rxjs";

/**
 * Service for retrieving albums tailored for each different part of the app.
 */
export class AlbumsService {
  constructor(readonly api: Api) {}

  /**
   * Retrieves the albums for the home page, which fetches the most recent albums
   * ordered by date.
   */
  public fetchForHome(): Observable<SimpleAlbum> {
    return this.api.getUserAlbums({ limit: 20 }).pipe(
      mergeMap((response) => response.items),
      map((savedAlbum) => ({
        id: savedAlbum.album.id,
        name: savedAlbum.album.name,
        artistName: savedAlbum.album.artists[0].name,
        coverUrl: savedAlbum.album.images[0].url,
      }))
    );
  }

  /**
   * Recursively retrieves all the albums in the user's library.
   */
  public fetchForAlbumsPage(): Observable<SimpleAlbum> {
    return this.api.getUserAlbums({}).pipe(
      expand((response) =>
        response.next ? this.api.getUserAlbums({ next: response.next }) : EMPTY
      ),
      mergeMap((response) => response.items),
      map((savedAlbum) => ({
        id: savedAlbum.album.id,
        name: savedAlbum.album.name,
        artistName: savedAlbum.album.artists[0].name,
        coverUrl: savedAlbum.album.images[0].url,
      }))
    );
  }
}
