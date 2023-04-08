import { AppConfig, AuthenticatedUser, Single } from "@spotless/types";
import { isValidToken } from "./auth-common";
import { ILogger } from "@spotless/services-logger";
import { Database } from "@spotless/data-db";
import {
  EMPTY,
  Subscription,
  concatMap,
  from,
  ignoreElements,
  interval,
  map,
  of,
  tap,
} from "rxjs";
import ky from "ky";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const DEFAULT_SCOPES =
  "streaming user-read-private user-read-email user-library-read user-follow-read";

const DEFAULT_TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes.

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
  private _dbSubscription: Subscription;
  private _timerSubscription: Subscription;

  constructor(
    private readonly appConfig: AppConfig,
    private readonly logger: ILogger,
    private readonly db: Database
  ) {
    this._timerSubscription = interval(DEFAULT_TOKEN_REFRESH_INTERVAL)
      .pipe(
        concatMap(() => from(this.db.auth.toArray())),
        map((cachedAuthResults) => cachedAuthResults.at(0)),
        concatMap((cachedAuth) => this.refreshTokenIfNeeded(cachedAuth))
      )
      .subscribe();

    this._dbSubscription = this.db
      .observe(() => this.db.auth.toArray())
      .pipe(
        map((cachedAuthResults) => cachedAuthResults.at(0)),
        concatMap((cachedAuth) => this.refreshTokenIfNeeded(cachedAuth))
      )
      .subscribe();
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
   * Returns the default redirect URI.
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

    this.db.auth.put(
      {
        __type: "AuthenticatedUser",
        accessToken: response.access_token,
        tokenType: response.token_type,
        expirationTimestamp,
        refreshToken: response.refresh_token,
        scope: response.scope,
      },
      0
    );
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

  private refreshTokenIfNeeded(
    cachedAuth: AuthenticatedUser | undefined
  ): Single<never> {
    if (!cachedAuth) {
      this.logger.log("No tokens found in cache, setting to unauthorized");
      return EMPTY;
    }

    if (isValidToken(cachedAuth)) {
      this.logger.log("Tokens retrieved from cache");
      return EMPTY;
    }

    this.logger.log(
      "Tokens retrieved from cache, but has expired. Refreshing..."
    );

    return this.refreshToken(cachedAuth);
  }

  /**
   * Refreshes the token using the refresh token from the auth state.
   */
  private refreshToken(auth: AuthenticatedUser): Single<never> {
    this.logger.log("Refreshing token...");

    return from(
      ky
        .post(
          `${SPOTIFY_TOKEN_URL}?grant_type=refresh_token&refresh_token=${auth.refreshToken}`,
          {
            headers: {
              Authorization: `Basic ${this.encodedClientInformation}`,
              ["Content-Type"]: "application/x-www-form-urlencoded",
            },
          }
        )
        .json() as Promise<SpotifyAuthResponse>
    ).pipe(
      tap((response) => {
        this.logger.log("Token refreshed successfully");

        this.saveAuthResponse({
          ...response,
          refresh_token: auth.refreshToken,
        });
      }),
      ignoreElements()
    );
  }
}
