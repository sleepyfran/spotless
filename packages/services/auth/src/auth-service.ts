import { AppConfig, AuthUser, AuthenticatedUser } from "@spotless/types";
import { retrieveFromCache, saveToCache } from "./auth-cache";
import { checkTokenValidity } from "./auth-common";
import { ILogger } from "@spotless/services-logger";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const DEFAULT_SCOPES =
  "streaming user-read-private user-read-email user-library-read user-follow-read";

type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

/**
 * Service in charge of authenticating the user against Spotify, storing tokens
 * and refreshing them when needed.
 */
export class AuthService {
  private _authUser: AuthUser;

  constructor(readonly appConfig: AppConfig, readonly logger: ILogger) {
    this._authUser = {
      __type: "UnauthorizedUser",
    };
  }

  /**
   * Initializes the authentication state from the cache, if available. If not,
   * sets it to unauthorized. If there is a token in the cache, it will attempt
   * to refresh it if it's needed.
   */
  public initAuthState(): Promise<void> {
    const cachedAuth = retrieveFromCache();

    if (cachedAuth) {
      this._authUser = cachedAuth.item;

      if (cachedAuth.needsRefresh) {
        return this.refreshToken(this._authUser as AuthenticatedUser);
      }

      this.logger.log("Tokens retrieved from cache");
      return Promise.resolve();
    }

    this.logger.log("No tokens found in cache, setting to unauthorized");
    this._authUser = {
      __type: "UnauthorizedUser",
    };

    return Promise.resolve();
  }

  /*
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
  public authorizeFromCallback(callbackUrl: string): Promise<void> {
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

  /**
   * Returns whether there is any authentication information available right now.
   */
  public isAuthenticated(): boolean {
    return this._authUser.__type === "AuthenticatedUser";
  }

  /**
   * Creates the authentication headers for the user, refreshing the token if
   * needed. If there is not authentication information or the token is not
   * refreshable anymore, throws an error.
   */
  public authenticationHeaders(): Promise<{ Authorization: string }> {
    if (this._authUser.__type === "UnauthorizedUser") {
      return Promise.reject("User is not authenticated");
    }

    const tokenNeedsRefresh = checkTokenValidity(this._authUser);
    if (!tokenNeedsRefresh) {
      return Promise.resolve(this.createAuthHeader(this._authUser));
    }

    return this.refreshToken(this._authUser).then(() => {
      return this.createAuthHeader(this._authUser as AuthenticatedUser);
    });
  }

  private createAuthHeader(auth: AuthenticatedUser): { Authorization: string } {
    return {
      Authorization: `${auth.tokenType} ${auth.accessToken}`,
    };
  }

  /**
   * Returs the default redirect URI.
   */
  private get redirectUri(): string {
    return `${this.appConfig.baseUrl}/auth/callback`;
  }

  /**
   * Returns the base auth token to interact with Spotify, which consists of
   * the client ID and secret encoded in base64.
   */
  private get encodedClientInformation(): string {
    return btoa(`${this.appConfig.clientId}:${this.appConfig.clientSecret}`);
  }

  /**
   * Sets the auth state to authenticated using the information from the auth
   * response.
   */
  private saveAuthResponse(response: SpotifyAuthResponse) {
    const expirationTimestamp =
      new Date().getTime() + response.expires_in * 1000;

    this._authUser = {
      __type: "AuthenticatedUser",
      accessToken: response.access_token,
      tokenType: response.token_type,
      expirationTimestamp,
      refreshToken: response.refresh_token,
      scope: response.scope,
    };
    saveToCache(this._authUser);
  }

  /**
   * Retrieves the token for the user using the given code from the auth callback.
   */
  private retrieveToken(code: string): Promise<void> {
    return fetch(
      `${SPOTIFY_TOKEN_URL}?grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUri}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.encodedClientInformation}`,
          ["Content-Type"]: "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => response.json())
      .then((response: SpotifyAuthResponse) => {
        this.saveAuthResponse(response);
      });
  }

  /**
   * Refreshes the token using the refresh token from the auth state.
   */
  private refreshToken(auth: AuthenticatedUser): Promise<void> {
    this.logger.log("Refreshing token...");

    return fetch(
      `${SPOTIFY_TOKEN_URL}?grant_type=refresh_token&refresh_token=${auth.refreshToken}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${this.encodedClientInformation}`,
          ["Content-Type"]: "application/x-www-form-urlencoded",
        },
      }
    )
      .then((response) => response.json())
      .then((response: SpotifyAuthResponse) => {
        this.logger.log("Token refreshed successfully");

        this.saveAuthResponse({
          ...response,
          refresh_token: auth.refreshToken,
        });
      })
      .catch(() => {
        this.logger.warn("Token refresh failed, setting user to unauthorized");

        // Probably the refresh token expired or it's invalid. Log the user out.
        this._authUser = { __type: "UnauthorizedUser" };
      });
  }
}
