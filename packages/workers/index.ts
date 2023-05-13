import { AppConfig } from "@spotless/types";
import AlbumsWorker from "./src/albums-worker?worker";
import ArtistsWorker from "./src/artists-worker?worker";
import GenresWorker from "./src/genres-worker?worker";
import SpotifyAuthWorker from "./src/spotify-auth-worker?worker";

/**
 * Starts the albums worker with the given config.
 * @param appConfig configuration loaded from the environment.
 */
export const startAlbumsWorker = (appConfig: AppConfig) => {
  const worker = new AlbumsWorker();

  worker.postMessage({
    __type: "init",
    appConfig,
  });

  return worker;
};

/**
 * Starts the artists worker with the given config.
 * @param appConfig configuration loaded from the environment.
 */
export const startArtistsWorker = (appConfig: AppConfig) => {
  const worker = new ArtistsWorker();

  worker.postMessage({
    __type: "init",
    appConfig,
  });

  return worker;
};

/**
 * Starts the genres worker with the given config.
 * @param appConfig configuration loaded from the environment.
 */
export const startGenresWorker = (appConfig: AppConfig) => {
  const worker = new GenresWorker();

  worker.postMessage({
    __type: "init",
    appConfig,
  });

  return worker;
};

/**
 * Starts the auth worker with the given config.
 * @param appConfig configuration loaded from the environment.
 */
export const startSpotifyAuthWorker = (appConfig: AppConfig) => {
  const worker = new SpotifyAuthWorker();

  worker.postMessage({
    __type: "init",
    appConfig,
  });

  return worker;
};
