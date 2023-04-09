import { AppConfig } from "@spotless/types";
import AlbumsWorker from "./src/albums-worker?worker";
import ArtistsWorker from "./src/artists-worker?worker";

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
