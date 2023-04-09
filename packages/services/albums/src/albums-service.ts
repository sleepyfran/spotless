import { BulkError, Database } from "@spotless/data-db";
import { Api } from "@spotless/services-api";
import { ILogger } from "@spotless/services-logger";
import { Album } from "@spotless/types";
import { EMPTY, Observable, expand, map, mergeMap, tap, toArray } from "rxjs";

/**
 * Service for retrieving albums from the Spotify API and populating the
 * app's database with them.
 */
export class AlbumsService {
  constructor(
    private readonly api: Api,
    private readonly db: Database,
    private readonly logger: ILogger
  ) {}

  /**
   * Recursively retrieves all the albums in the user's library and adds them
   * to the local database.
   */
  public hydrateDatabase(): Observable<Album[]> {
    this.logger.log("Starting albums database hydration");

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
        addedAt: new Date(savedAlbum.added_at),
      })),
      toArray(),
      tap((albums) => {
        this.logger.log(
          `Fetched ${albums.length} albums from API. Bulk adding to database...`
        );
        this.db.albums
          .bulkAdd(albums)
          .then(() => {
            this.logger.log("Database hydration complete");
          })
          .catch((e: BulkError) => {
            this.logger.log(
              `Hydration finished. ${e.failures.length} albums were not added because they were already registered.`
            );
          });
      })
    );
  }
}
