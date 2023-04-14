import { AppConfig } from "@spotless/types";
import { WorkerServices } from "@spotless/services-bootstrap";
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
  const { data } = event;

  switch (data.__type) {
    case "init":
      await initHydration(data.appConfig, HYDRATION_INTERVAL_MS, (services) => {
        return hydrateDatabase(services);
      });
      break;
    default:
      console.error("Unrecognized message sent to albums worker", event);
      break;
  }
};

const hydrateDatabase = (services: WorkerServices): Single<void> => {
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
      services.db.albums
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
