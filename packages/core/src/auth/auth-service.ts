import { AppConfig } from "../types/config.types";
import { AppState } from "../state";
import * as Http from "../http";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const DEFAULT_SCOPES = "user-read-private user-read-email";

export type SpotifyAuthResult = "success" | "errored";

type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

/**
 * Service dealing with all things auth. Can perform the initial authentication
 * against the Spotify API and deal with the expiration of tokens.
 */
export class SpotifyAuthService {
  constructor(readonly appState: AppState, readonly appConfig: AppConfig) {}

  /**
   * Returns the auth URL that we should follow to authenticate a new client.
   * @param redirectUri URL that Spotify should redirect to after authentication
   * @param clientId client ID that was assigned to the app on the API dashboard
   */
  public getAuthenticationUrl(): string {
    return `${SPOTIFY_AUTH_URL}?response_type=code&client_id=${this.appConfig.clientId}&scope=${DEFAULT_SCOPES}&redirect_uri=${this.redirectUri}`;
  }

  /**
   * Processes the callback URL returned by Spotify, attempting to retrieve the
   * code from the URL. If the code is there, attempts to authorize the app by
   * retrieving a token to the user's account. If not, throws an error with the
   * result returned by the API.
   * @param callbackUrl URL that was returned by Spotify.
   */
  public authorizeFromCallback(
    callbackUrl: string
  ): Promise<SpotifyAuthResult> {
    const parsedUrl = new URL(callbackUrl);

    if (!parsedUrl) {
      return Promise.reject("The given callback URL is invalid");
    }

    const code = parsedUrl.searchParams.get("code");
    const error = parsedUrl.searchParams.get("error");

    if (error) {
      console.error(error);
      return Promise.reject(error);
    }

    if (!code) {
      return Promise.reject(
        "There was no error field but no code field either"
      );
    }

    return this.retrieveToken(code);
  }

  private get redirectUri(): string {
    return `${this.appConfig.baseUrl}/auth/callback`;
  }

  private retrieveToken(code: string): Promise<SpotifyAuthResult> {
    const encodedClientInformation = btoa(
      `${this.appConfig.clientId}:${this.appConfig.clientSecret}`
    );

    return Http.post(
      `${SPOTIFY_TOKEN_URL}?grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUri}`,
      {
        headers: {
          Authorization: `Basic ${encodedClientInformation}`,
          ["Content-Type"]: "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => response.json())
      .then((response: SpotifyAuthResponse) => {
        this.appState.patch("auth", {
          __status: "authenticated",
          accessToken: response.access_token,
          tokenType: response.token_type,
          expiresIn: response.expires_in,
          refreshToken: response.refresh_token,
          scope: response.scope,
        });

        return "success";
      });
  }
}
