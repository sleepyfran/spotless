import { Database } from "@spotless/data-db";
import { Api, SpotifyApi } from "@spotless/services-api";
import { ILogger, ConsoleLogger } from "@spotless/services-logger";
import { AlbumsService } from "@spotless/services-albums";
import { ArtistsService } from "@spotless/services-artists";
import { AuthService } from "@spotless/services-auth";
import { AppConfig } from "@spotless/types";
import { AlbumsData } from "@spotless/data-albums";
import { AuthData } from "@spotless/data-auth";
import { Subscription } from "rxjs";

export type Data = {
  albums: AlbumsData;
  auth: AuthData;
};

export type Services = {
  api: Api;
  artistsService: ArtistsService;
  albumsService: AlbumsService;
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
  const authData = new AuthData(db);

  const api = new SpotifyApi(authData);
  const authService = new AuthService(appConfig, logger, db);
  const albumsService = new AlbumsService(api, db, logger);
  const artistsService = new ArtistsService(api);

  return {
    services: {
      api,
      artistsService,
      albumsService,
      authService,
      db,
      logger,
    },
    data: {
      albums: albumsData,
      auth: authData,
    },
  };
};
