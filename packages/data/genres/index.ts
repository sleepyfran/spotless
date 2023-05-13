import { Album, Genre } from "@spotless/types";
import { Single } from "@spotless/services-rx";

/**
 * Defines a data source that can retrieve information about genres.
 */
export interface GenreDataSource {
  /**
   * Retrieves the genres for the given album.
   */
  retrieveAllForAlbum(album: Album): Single<Genre[]>;
}
