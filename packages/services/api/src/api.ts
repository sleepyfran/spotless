import ky from "ky";
import { AuthService } from "@spotless/services-auth";

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
  ): Promise<SpotifyApi.UsersSavedAlbumsResponse>;

  /**
   * Retrieves a specified limit or 50 of the user's followed artists.
   * @param props object containing one or more of the following properties:
   * - next: the next page of results to retrieve
   * - limit: the number of results to retrieve. Defaults to 50.
   */
  getUserArtists(
    props: PaginatedProps
  ): Promise<SpotifyApi.UsersFollowedArtistsResponse>;
}

export class SpotifyApi implements Api {
  constructor(private readonly authService: AuthService) {}

  public getUserAlbums({
    next,
    limit,
  }: PaginatedProps): Promise<SpotifyApi.UsersSavedAlbumsResponse> {
    const endpoint = next ? next : `/me/albums?limit=${limit || 50}`;
    return this.get(endpoint);
  }

  public getUserArtists({
    next,
    limit,
  }: PaginatedProps): Promise<SpotifyApi.UsersFollowedArtistsResponse> {
    const endpoint = next
      ? next
      : `/me/following?type=artist&limit=${limit || 50}`;
    return this.get(endpoint);
  }

  private async get<T>(endpoint: string): Promise<T> {
    const authHeaders = await this.authService.authenticationHeaders();

    return ky
      .get(`${BASE_URL}${endpoint}`, {
        headers: authHeaders,
      })
      .json();
  }
}
