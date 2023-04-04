import { Api } from "@spotless/services-api";
import { SimpleAlbum } from "@spotless/types";

/**
 * Service for retrieving albums tailored for each different part of the app.
 */
export class AlbumsService {
  constructor(readonly api: Api) {}

  /**
   * Retrieves the albums for the home page, which fetches the most recent albums
   * ordered by date.
   */
  public home(): Promise<SimpleAlbum[]> {
    return this.api.getUserAlbums({ limit: 50 }).then((savedAlbums) => {
      return savedAlbums.items.map((savedAlbum) => ({
        id: savedAlbum.album.id,
        name: savedAlbum.album.name,
        artistName: savedAlbum.album.artists[0].name,
        coverUrl: savedAlbum.album.images[0].url,
      }));
    });
  }
}
