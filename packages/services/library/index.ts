import { Api } from "@spotless/data-api";
import { Database } from "@spotless/data-db";
import { Single } from "@spotless/services-rx";
import { tap } from "rxjs";

/**
 * Exposes a set of mutations that orchestrates the local database and the
 * remove API.
 */
export class Library {
  constructor(private readonly api: Api, private readonly db: Database) {}

  /**
   * Removes the specified album from the user's library and the local database.
   * @param id ID of the album to remove.
   */
  public removeAlbum(id: string): Single<void> {
    return this.api.userLibrary
      .removeAlbum(id)
      .pipe(tap(() => this.db.albums.delete(id)));
  }
}
