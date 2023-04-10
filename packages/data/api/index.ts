import { AuthData } from "@spotless/data-auth";
import { Album, Artist, Single } from "@spotless/types";
import { Observable, from, switchMap } from "rxjs";
import ky from "ky";

/**
 * Options for paginated APIs.
 */
export type PaginatedProps = {
  /**
   * Next page of results to retrieve.
   */
  next?: string;

  /**
   * Number of results to retrieve. If using `next`, this will be ignored.
   */
  limit?: number;
};

/**
 * Response for a paginated API.
 */
export type PaginatedResponse<T> = {
  /**
   * The next page of results, if any.
   */
  next?: string;

  /**
   * The items returned by the API.
   */
  items: T[];
};

/**
 * Defines the abstract API to retrieve the library of a user.
 */
export interface UserLibraryApi {
  /**
   * Retrieves a specified limit or 50 of the user's saved albums.
   * @param props object containing one or more of the following properties:
   * - next: the next page of results to retrieve
   * - limit: the number of results to retrieve. Defaults to 50.
   */
  getAlbums(props: PaginatedProps): Single<PaginatedResponse<Album>>;

  /**
   * Retrieves a specified limit or 50 of the user's followed artists.
   * @param props object containing one or more of the following properties:
   * - next: the next page of results to retrieve
   * - limit: the number of results to retrieve. Defaults to 50.
   */
  getArtists(props: PaginatedProps): Single<PaginatedResponse<Artist>>;
}

/**
 * Defines the abstract API that can be called to retrieve data from whatever
 * music provider we're using (Spotify, Apple Music, etc).
 */
export interface Api {
  userLibrary: UserLibraryApi;
}

/**
 * Defines a client connection to an API, which exposes utility methods for
 * retrieving working with paginated endpoints and generating URLs.
 */
export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly authData: AuthData
  ) {}

  /**
   * Returns the given next URL, or the built URL to the given endpoint if next
   * is not provided.
   * @param defaultEndpoint endpoint to use if next is not provided
   * @param next next URL to the resource
   */
  public nextOrDefault(defaultEndpoint: string, next?: string): string {
    return next ? next : this.buildUrl(defaultEndpoint);
  }

  /**
   * Wrapper around a get request that automatically adds the authentication
   * headers and returns the JSON response.
   */
  public get<T>(url: string): Observable<T> {
    return from(this.authData.authenticationHeaders()).pipe(
      switchMap((authHeaders) => {
        return from(
          ky
            .get(url, {
              headers: authHeaders,
            })
            .json() as Promise<T>
        );
      })
    );
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
