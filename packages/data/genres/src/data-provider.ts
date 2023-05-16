import { Database, DataProvider } from "@spotless/data-db";
import { IndexedGenre } from "@spotless/types";

/**
 * Provides access to the genres stored in the database.
 */
export class GenresData extends DataProvider<IndexedGenre> {
  constructor(db: Database) {
    super(db, db.genres, "name");
  }
}
