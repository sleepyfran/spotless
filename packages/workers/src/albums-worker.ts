import { AppConfig } from "@spotless/types";
import { initHydration } from "./workers.common";
import {
  EMPTY,
  Observable,
  expand,
  ignoreElements,
  mergeMap,
  tap,
  toArray,
} from "rxjs";
import { Services } from "@spotless/services-bootstrap";
import { BulkError } from "@spotless/data-db";

export type InitWorkerMessage = {
  __type: "init";
  appConfig: AppConfig;
};

export type WorkerMessage = InitWorkerMessage;

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data } = event;

  switch (data.__type) {
    case "init":
      await initHydration(data.appConfig, (services) => {
        return hydrateDatabase(services);
      });
      break;
    default:
      console.error("Unrecognized message sent to albums worker", event);
      break;
  }
};

const hydrateDatabase = (services: Services): Observable<void> => {
  services.logger.log("Starting album database hydration...");

  return services.api.userLibrary.getAlbums({}).pipe(
    expand((response) =>
      response.next
        ? services.api.userLibrary.getAlbums({ next: response.next })
        : EMPTY
    ),
    mergeMap((response) => response.items),
    toArray(),
    tap((albums) => {
      services.logger.log(
        `Fetched ${albums.length} albums from API. Bulk adding to database...`
      );
      services.db.albums
        .bulkAdd(albums)
        .then(() => {
          services.logger.log("Albums database hydration complete");
        })
        .catch((e: BulkError) => {
          services.logger.log(
            `Hydration finished. ${e.failures.length} albums were not added because they were already registered.`
          );
        });
    }),
    ignoreElements()
  );
};
