import { Database, DataProvider } from "@spotless/data-db";
import { Artist } from "@spotless/types";

/**
 * Exposes the queries that the app can fetch from the artists table.
 */
export class ArtistsData extends DataProvider<Artist> {
  constructor(db: Database) {
    super(db, db.artists, "name");
  }
}
