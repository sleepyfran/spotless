import ky from "ky";
import { Observable, from, switchMap } from "rxjs";
import { AuthData } from "@spotless/data-auth";

const BASE_URL = "https://api.spotify.com/v1";

export type PaginatedProps = {
  next?: string;
  limit?: number;
};

export interface Api {
  /**
   * Retrieves a specified limit or 50 of the user's saved albums.
   * @param props object containing one or more of the following properties:
   * - next: the next page of results to retrieve
   * - limit: the number of results to retrieve. Defaults to 50.
   */
  getUserAlbums(
    props: PaginatedProps
  ): Observable<SpotifyApi.UsersSavedAlbumsResponse>;

  /**
   * Retrieves a specified limit or 50 of the user's followed artists.
   * @param props object containing one or more of the following properties:
   * - next: the next page of results to retrieve
   * - limit: the number of results to retrieve. Defaults to 50.
   */
  getUserArtists(
    props: PaginatedProps
  ): Observable<SpotifyApi.UsersFollowedArtistsResponse>;
}

export class SpotifyApi implements Api {
  constructor(private readonly authData: AuthData) {}

  public getUserAlbums({
    next,
    limit,
  }: PaginatedProps): Observable<SpotifyApi.UsersSavedAlbumsResponse> {
    return this.getNextOrDefault(`/me/albums?limit=${limit || 50}`, next);
  }

  public getUserArtists({
    next,
    limit,
  }: PaginatedProps): Observable<SpotifyApi.UsersFollowedArtistsResponse> {
    return this.getNextOrDefault(
      `/me/following?type=artist&limit=${limit || 50}`,
      next
    );
  }

  private buildUrl(endpoint: string): string {
    return `${BASE_URL}${endpoint}`;
  }

  private getNextOrDefault<T>(
    defaultEndpoint: string,
    next?: string
  ): Observable<T> {
    return next
      ? this.get<T>(next)
      : this.get<T>(this.buildUrl(defaultEndpoint));
  }

  private get<T>(url: string): Observable<T> {
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
}
