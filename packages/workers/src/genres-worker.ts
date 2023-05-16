import { initializeWorkerServices } from "@spotless/services-bootstrap";
import { AppConfig } from "@spotless/types";
import { concatMap, delay } from "rxjs";

export type InitWorkerMessage = {
  __type: "init";
  appConfig: AppConfig;
};

export type WorkerMessage = InitWorkerMessage;

self.onmessage = (event: MessageEvent<InitWorkerMessage>) => {
  const { data: eventData } = event;

  switch (eventData.__type) {
    case "init":
      initializeAndStartHydration(eventData.appConfig);
      break;
    default:
      console.error("Unrecognized message sent to albums worker", event);
      break;
  }
};

const TWO_MINUTES_IN_MS = 2 * 60 * 1000;

const initializeAndStartHydration = (appConfig: AppConfig) => {
  const { services, data } = initializeWorkerServices(appConfig);
  const logger = services.createLogger("GenresWorker");

  data.auth
    .authenticatedUser()
    .pipe(
      /* Give a chance to the population of albums to finish. */
      delay(TWO_MINUTES_IN_MS),
      concatMap(() => services.hydrators.genres.startOnAlbumChanges())
    )
    .subscribe({
      next: (album) =>
        logger.log("Genre hydration completed for album", album.name),
      error: (e) => logger.error("Error while hydrating genres", e),
      complete: () => logger.log("Genre hydration complete"),
    });
};
