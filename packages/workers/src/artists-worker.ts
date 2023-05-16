import { AppConfig } from "@spotless/types";
import { initHydration } from "./workers.common";
import { BulkError } from "@spotless/data-db";
import { Data, WorkerServices } from "@spotless/services-bootstrap";
import { Observable, expand, EMPTY, tap, ignoreElements } from "rxjs";

export type InitWorkerMessage = {
  __type: "init";
  appConfig: AppConfig;
};

export type WorkerMessage = InitWorkerMessage;

const HYDRATION_INTERVAL_MS = 1000 * 60 * 5; // 5 minutes.

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data: eventData } = event;

  switch (eventData.__type) {
    case "init":
      await initHydration(
        eventData.appConfig,
        HYDRATION_INTERVAL_MS,
        (data, services) => {
          return hydrateDatabase(data, services);
        }
      );
      break;
    default:
      console.error("Unrecognized message sent to artists worker", event);
      break;
  }
};

const hydrateDatabase = (
  data: Data,
  services: WorkerServices
): Observable<void> => {
  const logger = services.createLogger("ArtistsWorker");
  logger.log("Starting artist database hydration...");

  return services.api.userLibrary.getArtists({ limit: 50 }).pipe(
    expand((response) =>
      response.next
        ? services.api.userLibrary.getArtists({ next: response.next })
        : EMPTY
    ),
    tap((artists) => {
      logger.log(
        `Fetched ${artists.items.length} artists from API. Bulk adding to database...`
      );

      data.db.artists
        .bulkAdd(artists.items)
        .then(() => {
          logger.log("Artist database hydration complete");
        })
        .catch((e: BulkError) => {
          logger.log(
            `${e.failures.length} artists were not added because they were already registered.`
          );
        });
    }),
    ignoreElements()
  );
};
