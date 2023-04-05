import { Api } from "@spotless/services-api";
import { SimpleArtist } from "@spotless/types";

/**
 * Service for retrieving artists tailored for each different part of the app.
 */
export class ArtistsService {
  constructor(readonly api: Api) {}

  /**
   * Retrieves the artists for the artists page.
   */
  public fetchForArtistsPage(): Promise<SimpleArtist[]> {
    return this.api.getUserArtists({ limit: 50 }).then((savedArtists) => {
      return savedArtists.artists.items.map((artist) => {
        return {
          id: artist.id,
          name: artist.name,
          imageUrl: artist.images[0]?.url,
        };
      });
    });
  }
}
