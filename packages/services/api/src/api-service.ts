import { Axios } from "axios";
import { AuthService } from "@spotless/services-auth";

const BASE_URL = "https://api.spotify.com/v1";

export interface Api {
  /**
   * Retrieves 50 of the user's saved albums.
   * @param next URL to the page to retrieve. If not provided, the first page will
   * be retrieved.
   */
  getUserAlbums(next?: string): Promise<SpotifyApi.UsersSavedAlbumsResponse>;
}

export class SpotifyApi implements Api {
  private _client: Axios;

  constructor(private readonly authService: AuthService) {
    this._client = new Axios({
      baseURL: BASE_URL,
    });

    // Attempt to automatically add the user token to each request.
    this._client.interceptors.request.use(async (config) => {
      const authHeader = await authService.authenticationHeaders();
      config.headers.Authorization = authHeader;
      return config;
    });
  }

  public getUserAlbums(
    next?: string
  ): Promise<SpotifyApi.UsersSavedAlbumsResponse> {
    const endpoint = next ? next : "/me/albums";
    return this._client.get(endpoint).then((response) => response.data);
  }
}
