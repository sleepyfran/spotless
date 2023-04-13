import { Database } from "@spotless/data-db";
import { Api } from "@spotless/data-api";
import { createSpotifyApi } from "@spotless/data-api-spotify";
import { LoggerFactory, createConsoleLogger } from "@spotless/services-logger";
import { AuthService } from "@spotless/services-auth";
import { SpotifyAuth } from "@spotless/services-auth-spotify";
import { Player } from "@spotless/services-player";
import { SpotifyPlayer } from "@spotless/services-player-spotify";
import { AppConfig } from "@spotless/types";
import { AlbumsData } from "@spotless/data-albums";
import { ArtistsData } from "@spotless/data-artists";
import { AuthData } from "@spotless/data-auth";
import { PlayerData } from "@spotless/data-player";

export type Data = {
  albums: AlbumsData;
  artists: ArtistsData;
  auth: AuthData;
  player: PlayerData;
};

type BaseServices = {
  api: Api;
  authService: AuthService;
  createLogger: LoggerFactory;
  db: Database;
};

export type WorkerServices = BaseServices;
export type MainServices = BaseServices & { player: Player };

const initializeBase = (
  appConfig: AppConfig
): { services: BaseServices; data: Data } => {
  const db = new Database();

  const albumsData = new AlbumsData(db);
  const artistsData = new ArtistsData(db);
  const authData = new AuthData(db);
  const playerData = new PlayerData();

  const api = createSpotifyApi(authData);
  const authService: AuthService = new SpotifyAuth(
    appConfig,
    createConsoleLogger,
    db
  );

  return {
    services: {
      api,
      authService,
      db,
      createLogger: createConsoleLogger,
    },
    data: {
      albums: albumsData,
      auth: authData,
      artists: artistsData,
      player: playerData,
    },
  };
};

/**
 * Initializes the services for the worker thread.
 * @param appConfig config for the app loaded from the environment.
 */
export const initializeWorkerServices = (
  appConfig: AppConfig
): {
  services: WorkerServices;
  data: Data;
} => {
  const logger = createConsoleLogger("worker");
  logger.log("Initializing worker services");

  return initializeBase(appConfig);
};

/**
 * Initializes the services for the main thread.
 * @param appConfig config for the app loaded from the environment.
 */
export const initializeMainServices = (
  appConfig: AppConfig
): {
  services: MainServices;
  data: Data;
} => {
  const logger = createConsoleLogger("main");
  logger.log("Initializing main services");

  const { services, data } = initializeBase(appConfig);
  const player = new SpotifyPlayer(
    data.auth,
    data.player,
    services.api,
    services.createLogger
  );

  return {
    services: {
      ...services,
      player,
    },
    data,
  };
};
