import { AppConfig } from "@spotless/types";
import { Data, WorkerServices } from "@spotless/services-bootstrap";
import { BulkError } from "@spotless/data-db";
import { Single } from "@spotless/services-rx";
import { initHydration } from "./workers.common";
import { EMPTY, expand, ignoreElements, tap } from "rxjs";

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
      console.error("Unrecognized message sent to albums worker", event);
      break;
  }
};

const hydrateDatabase = (
  data: Data,
  services: WorkerServices
): Single<void> => {
  const logger = services.createLogger("AlbumsWorker");
  logger.log("Starting album database hydration...");

  return services.api.userLibrary.getAlbums({}).pipe(
    expand((response) =>
      response.next
        ? services.api.userLibrary.getAlbums({ next: response.next })
        : EMPTY
    ),
    tap((albums) => {
      logger.log(
        `Fetched ${albums.items.length} albums from API. Bulk adding to database...`
      );
      data.db.albums
        .bulkAdd(albums.items)
        .then(() => {
          logger.log("Bulk add finished.");
        })
        .catch((e: BulkError) => {
          logger.log(
            `${e.failures.length} albums were not added because they were already registered.`
          );
        });
    }),
    ignoreElements()
  );
};
