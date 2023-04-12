import { Database } from "@spotless/data-db";
import { AuthenticatedUser } from "@spotless/types";
import { Observable, map } from "rxjs";

/**
 * Provides queries and mutations for the auth table in the database.
 */
export class AuthData {
  constructor(readonly db: Database) {}

  /**
   * Returns the authenticated user, if any.
   */
  public authenticatedUser(): Observable<AuthenticatedUser | undefined> {
    return this.db.observe(() =>
      this.db.auth.toArray().then((users) => users.at(0))
    );
  }

  /**
   * Returns the authentication headers for the authenticated user, if any. If
   * the user is not authenticated, the observable will fail.
   */
  public authenticationHeaders(): Observable<{ Authorization: string }> {
    return this.authenticatedUser().pipe(
      map((auth) => {
        if (!auth) {
          throw new Error("User is not authenticated");
        }

        return {
          Authorization: `${auth.tokenType} ${auth.accessToken}`,
        };
      })
    );
  }
}
