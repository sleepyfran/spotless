import { AuthData } from "@spotless/data-auth";
import { Album, Artist } from "@spotless/types";
import { Single, singleFrom } from "@spotless/services-rx";
import { from, switchMap } from "rxjs";
import ky from "ky";
import type { Options } from "ky";

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

export interface PlayerApi {
  /**
   * Plays the given album.
   */
  play(item: Album): Single<void>;

  /**
   * Transfers the playback to the specified device ID.
   * TODO: This is Spotify specific and shouldn't be in the general api.
   */
  transferPlayback(deviceId: string): Single<void>;
}

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
   * Removes the specified album from the user's library.
   * @param id the ID of the album to remove.
   */
  removeAlbum(id: string): Single<void>;

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
  player: PlayerApi;
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
  public get<T>(url: string): Single<T> {
    return this.request("get", url);
  }

  /**
   * Wrapper around a post request that automatically adds the authentication
   * headers and returns the JSON response.
   */
  public post<T, R>(url: string, body: T): Single<R> {
    return this.request("post", url, { body: JSON.stringify(body) });
  }

  /**
   * Wrapper around a put request that automatically adds the authentication
   * headers and returns the JSON response.
   */
  public put<T, R>(url: string, body: T): Single<R> {
    return this.request("put", url, { body: JSON.stringify(body) });
  }

  /**
   * Wrapper around a remove request that automatically adds the authentication
   * headers and returns the JSON response.
   */
  public delete<T>(url: string): Single<T> {
    return this.request("delete", url);
  }

  private request<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    options?: Options
  ): Single<T> {
    return singleFrom(this.authData.authenticationHeaders()).pipe(
      switchMap((authHeaders) => {
        return from(
          ky[method](this.decorateUrlWithBase(url), {
            ...options,
            headers: authHeaders,
          }).json() as Promise<T>
        );
      })
    );
  }

  private decorateUrlWithBase(url: string): string {
    return url.startsWith("http") ? url : this.buildUrl(url);
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
