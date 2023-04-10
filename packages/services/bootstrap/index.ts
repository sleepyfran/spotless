import { Database } from "@spotless/data-db";
import { Api } from "@spotless/data-api";
import { createSpotifyApi } from "@spotless/data-api-spotify";
import { ILogger, ConsoleLogger } from "@spotless/services-logger";
import { AuthService } from "@spotless/services-auth";
import { AppConfig } from "@spotless/types";
import { AlbumsData } from "@spotless/data-albums";
import { ArtistsData } from "@spotless/data-artists";
import { AuthData } from "@spotless/data-auth";

export type Data = {
  albums: AlbumsData;
  artists: ArtistsData;
  auth: AuthData;
};

export type Services = {
  api: Api;
  authService: AuthService;
  db: Database;
  logger: ILogger;
};

/**
 * Initializes all services and returns them as a single object.
 * @param appConfig configuration loaded from the environment.
 */
export const initialize = (
  context: "worker" | "main",
  appConfig: AppConfig
): { services: Services; data: Data } => {
  const logger = new ConsoleLogger();

  logger.log(`Initializing services for ${context} thread...`);

  const db = new Database();

  const albumsData = new AlbumsData(db);
  const artistsData = new ArtistsData(db);
  const authData = new AuthData(db);

  const api = createSpotifyApi(authData);
  const authService = new AuthService(appConfig, logger, db);

  return {
    services: {
      api,
      authService,
      db,
      logger,
    },
    data: {
      albums: albumsData,
      auth: authData,
      artists: artistsData,
    },
  };
};
