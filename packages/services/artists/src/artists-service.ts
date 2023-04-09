import { Api } from "@spotless/services-api";
import { ILogger } from "@spotless/services-logger";
import { Artist } from "@spotless/types";
import { BulkError, Database } from "@spotless/data-db";
import { Observable, map, mergeMap, expand, EMPTY, toArray, tap } from "rxjs";

/**
 * Service for retrieving artists tailored for each different part of the app.
 */
export class ArtistsService {
  constructor(
    private readonly api: Api,
    private readonly db: Database,
    private readonly logger: ILogger
  ) {}

  /**
   * Retrieves the artists for the artists page.
   */
  public hydrateDatabase(): Observable<Artist[]> {
    this.logger.log("Starting artists database hydration");

    return this.api.getUserArtists({ limit: 50 }).pipe(
      expand((response) =>
        response.artists.next
          ? this.api.getUserArtists({ next: response.artists.next })
          : EMPTY
      ),
      mergeMap((response) => response.artists.items),
      map((artist) => ({
        id: artist.id,
        name: artist.name,
        imageUrl: artist.images[0]?.url,
      })),
      toArray(),
      tap((artists) => {
        this.logger.log(
          `Fetched ${artists.length} artists from API. Bulk adding to database...`
        );

        this.db.artists
          .bulkAdd(artists)
          .then(() => {
            this.logger.log("Database hydration complete");
          })
          .catch((e: BulkError) => {
            this.logger.log(
              `Hydration finished. ${e.failures.length} artists were not added because they were already registered.`
            );
          });
      })
    );
  }
}
