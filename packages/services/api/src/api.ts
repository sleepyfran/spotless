import ky from "ky";
import { AuthService } from "@spotless/services-auth";
import { Observable, from, switchMap } from "rxjs";

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
  constructor(private readonly authService: AuthService) {}

  public getUserAlbums({
    next,
    limit,
  }: PaginatedProps): Observable<SpotifyApi.UsersSavedAlbumsResponse> {
    const endpoint = next ? next : `/me/albums?limit=${limit || 50}`;
    return this.get(endpoint);
  }

  public getUserArtists({
    next,
    limit,
  }: PaginatedProps): Observable<SpotifyApi.UsersFollowedArtistsResponse> {
    const endpoint = next
      ? next
      : `/me/following?type=artist&limit=${limit || 50}`;
    return this.get(endpoint);
  }

  private get<T>(endpoint: string): Observable<T> {
    return from(this.authService.authenticationHeaders()).pipe(
      switchMap((authHeaders) => {
        return from(
          ky
            .get(`${BASE_URL}${endpoint}`, {
              headers: authHeaders,
            })
            .json() as Promise<T>
        );
      })
    );
  }
}
