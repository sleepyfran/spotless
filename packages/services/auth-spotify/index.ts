import { AuthService } from "@spotless/services-auth";
import { Logger } from "@spotless/services-logger";
import { Database } from "@spotless/data-db";
import { AppConfig } from "@spotless/types";

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const DEFAULT_SCOPES =
  "streaming user-read-private user-read-email user-library-read user-follow-read";

const DEFAULT_AUTH_TIMEOUT = 1000 * 60 * 5; // 5 minutes.

export type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
};

type Func = () => void;

/**
 * Returns the base64 encoded client information for the Spotify API.
 */
export const encodedClientInformation = (appConfig: AppConfig): string => {
  return btoa(`${appConfig.clientId}:${appConfig.clientSecret}`);
};

/**
 * Saves the given auth response to the database.
 */
export const saveAuthResponse = (
  response: SpotifyAuthResponse,
  db: Database
) => {
  const expirationTimestamp = new Date().getTime() + response.expires_in * 1000;

  db.auth.put(
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
};

/**
 * Specific implementation of the auth for Spotify.
 */
export class SpotifyAuth implements AuthService {
  constructor(
    private readonly appConfig: AppConfig,
    private readonly logger: Logger,
    private readonly db: Database
  ) {}

  /**
   * Implementation of the Spotify auth flow. This creates a popup window that
   * loads the auth URL of Spotify and waits for the app to redirect back to our
   * app, once this happens we can try to extract the code from the URL and fetch
   * the token from the API.
   *
   * The flow will timeout if the user doesn't complete the login process after
   * five minutes.
   */
  public authorize(): Promise<void> {
    return this.timeoutPromise(DEFAULT_AUTH_TIMEOUT, () => {
      const loginWindow = this.createTimedLoginPopup();
      if (!loginWindow) {
        throw "Could not open login window";
      }

      const interval = setInterval(() => {
        try {
          const parsedUrl = new URL(loginWindow.location.href);
          const code = parsedUrl.searchParams.get("code");
          const error = parsedUrl.searchParams.get("error");

          if (!code && !error) {
            // The login flow is still in progress, wait for next tick.
            return;
          }

          loginWindow.close();
          return this.tryGetTokenFromResponse(code, error);
        } catch (error) {
          /* We only want the finally. */
        } finally {
          if (!loginWindow || loginWindow.closed) {
            clearInterval(interval);
          }
        }
      }, 500);
    });
  }

  public unauthorize(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private getAuthenticationUrl(): string {
    return `${SPOTIFY_AUTH_URL}?response_type=code&client_id=${this.appConfig.clientId}&scope=${DEFAULT_SCOPES}&redirect_uri=${this.redirectUri}`;
  }

  private tryGetTokenFromResponse(
    code: string | null,
    error: string | null
  ): Promise<void> {
    if (error) {
      this.logger.error(`Error happened during Spotify login: ${error}`);
      return Promise.reject(error);
    }

    if (!code) {
      return Promise.reject(
        "There was no error field but no code field either"
      );
    }

    return this.retrieveToken(code);
  }

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

  private get encodedClientInformation(): string {
    return encodedClientInformation(this.appConfig);
  }

  private get redirectUri(): string {
    return `${this.appConfig.baseUrl}/auth/callback`;
  }

  private createTimedLoginPopup(): Window | null {
    const width = 500;
    const height = 800;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    return window.open(
      this.getAuthenticationUrl(),
      "Spotify",
      `popup=true, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  }

  private timeoutPromise(
    ms: number,
    setup: (resolve: Func) => void
  ): Promise<void> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        throw "Action took too long";
      }, ms);

      setup(() => {
        clearTimeout(timeout);
        resolve();
      });
    });
  }
}
