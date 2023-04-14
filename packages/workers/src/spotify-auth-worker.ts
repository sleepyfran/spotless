import { AppConfig, AuthenticatedUser } from "@spotless/types";
import { Single, singleFrom } from "@spotless/services-rx";
import { initHydration } from "./workers.common";
import {
  EMPTY,
  Observable,
  concatMap,
  from,
  ignoreElements,
  map,
  tap,
} from "rxjs";
import { WorkerServices } from "@spotless/services-bootstrap";
import { isValidToken } from "@spotless/services-auth";
import {
  SpotifyAuthResponse,
  encodedClientInformation,
  saveAuthResponse,
} from "@spotless/services-auth-spotify";
import ky from "ky";
import { Logger } from "@spotless/services-logger";

export type InitWorkerMessage = {
  __type: "init";
  appConfig: AppConfig;
};

export type WorkerMessage = InitWorkerMessage;

const HYDRATION_INTERVAL_MS = 1000 * 60 * 5; // 5 minutes.

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data } = event;

  switch (data.__type) {
    case "init":
      await initHydration(data.appConfig, HYDRATION_INTERVAL_MS, (services) => {
        return hydrateToken(data.appConfig, services);
      });
      break;
    default:
      console.error("Unrecognized message sent to albums worker", event);
      break;
  }
};

const hydrateToken = (
  appConfig: AppConfig,
  services: WorkerServices
): Observable<void> => {
  const logger = services.createLogger("SpotifyAuthWorker");
  logger.log("Checking auth token...");

  return from(services.db.auth.toArray()).pipe(
    map((cachedAuthResults) => cachedAuthResults.at(0)),
    concatMap((cachedAuth) =>
      refreshTokenIfNeeded(appConfig, services, logger, cachedAuth)
    ),
    ignoreElements()
  );
};

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const refreshTokenIfNeeded = (
  appConfig: AppConfig,
  services: WorkerServices,
  logger: Logger,
  cachedAuth: AuthenticatedUser | undefined
): Single<never> => {
  if (!cachedAuth) {
    logger.log("No tokens found in cache, ignoring...");
    return EMPTY;
  }

  if (isValidToken(cachedAuth)) {
    logger.log("Token is already valid");
    return EMPTY;
  }

  logger.log("Tokens are either expired or about to expire. Refreshing...");

  return refreshToken(appConfig, services, logger, cachedAuth);
};

/**
 * Refreshes the token using the refresh token from the auth state.
 */
const refreshToken = (
  appConfig: AppConfig,
  services: WorkerServices,
  logger: Logger,
  auth: AuthenticatedUser
): Single<never> =>
  singleFrom(
    ky
      .post(
        `${SPOTIFY_TOKEN_URL}?grant_type=refresh_token&refresh_token=${auth.refreshToken}`,
        {
          headers: {
            Authorization: `Basic ${encodedClientInformation(appConfig)}`,
            ["Content-Type"]: "application/x-www-form-urlencoded",
          },
        }
      )
      .json() as Promise<SpotifyAuthResponse>
  ).pipe(
    tap((response) => {
      logger.log("Token refreshed successfully, saving to database");

      saveAuthResponse(
        {
          ...response,
          refresh_token: auth.refreshToken,
        },
        services.db
      );
    }),
    ignoreElements()
  );
