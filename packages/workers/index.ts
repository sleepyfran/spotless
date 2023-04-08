import { AppConfig } from "@spotless/types";
import AlbumsWorker from "./src/albums-worker?worker";

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
