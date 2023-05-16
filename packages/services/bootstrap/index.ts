import { Database } from "@spotless/data-db";
import { Api } from "@spotless/data-api";
import { createSpotifyApi } from "@spotless/data-api-spotify";
import { GenreDataSource, GenresData } from "@spotless/data-genres";
import { GenresMusicBrainzData } from "@spotless/data-genres-musicbrainz";
import { LoggerFactory, createConsoleLogger } from "@spotless/services-logger";
import { AuthService } from "@spotless/services-auth";
import { SpotifyAuth } from "@spotless/services-auth-spotify";
import { Library } from "@spotless/services-library";
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
  genresSource: GenreDataSource;
  genres: GenresData;
  player: PlayerData;
};

type BaseServices = {
  api: Api;
  authService: AuthService;
  createLogger: LoggerFactory;
  db: Database;
  library: Library;
};

export type WorkerServices = BaseServices;
export type MainServices = BaseServices & { player: Player };
export type SpotifyServices = { player: SpotifyPlayer };

const initializeBase = (
  appConfig: AppConfig
): { services: BaseServices; data: Data } => {
  const db = new Database();

  const authData = new AuthData(db);
  const api = createSpotifyApi(authData);

  const albumsData = new AlbumsData(db, api);
  const artistsData = new ArtistsData(db);
  const genresSource = new GenresMusicBrainzData();
  const genresData = new GenresData(db);
  const playerData = new PlayerData();

  const authService: AuthService = new SpotifyAuth(
    appConfig,
    createConsoleLogger,
    db
  );
  const library = new Library(api, db);

  return {
    services: {
      api,
      authService,
      createLogger: createConsoleLogger,
      db,
      library,
    },
    data: {
      albums: albumsData,
      auth: authData,
      artists: artistsData,
      genresSource,
      genres: genresData,
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
    data.albums,
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
