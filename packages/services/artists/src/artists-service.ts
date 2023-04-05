import { Api } from "@spotless/services-api";
import { SimpleArtist } from "@spotless/types";
import { Observable, map, mergeMap } from "rxjs";

/**
 * Service for retrieving artists tailored for each different part of the app.
 */
export class ArtistsService {
  constructor(readonly api: Api) {}

  /**
   * Retrieves the artists for the artists page.
   */
  public fetchForArtistsPage(): Observable<SimpleArtist> {
    return this.api.getUserArtists({ limit: 50 }).pipe(
      mergeMap((response) => response.artists.items),
      map((artist) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images[0]?.url,
      }))
    );
  }
}
