import { AppConfig } from "@spotless/types";
import { initHydration } from "./workers.common";
import { BulkError } from "@spotless/data-db";
import { Services } from "@spotless/services-bootstrap";
import {
  Observable,
  expand,
  EMPTY,
  mergeMap,
  map,
  toArray,
  tap,
  ignoreElements,
} from "rxjs";

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
      console.error("Unrecognized message sent to artists worker", event);
      break;
  }
};

const hydrateDatabase = (services: Services): Observable<void> => {
  services.logger.log("Starting artist database hydration...");

  return services.api.getUserArtists({ limit: 50 }).pipe(
    expand((response) =>
      response.artists.next
        ? services.api.getUserArtists({ next: response.artists.next })
        : EMPTY
    ),
    mergeMap((response) => response.artists.items),
    map((artist) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url,
    })),
    toArray(),
    tap((artists) => {
      services.logger.log(
        `Fetched ${artists.length} artists from API. Bulk adding to database...`
      );

      services.db.artists
        .bulkAdd(artists)
        .then(() => {
          services.logger.log("Artist database hydration complete");
        })
        .catch((e: BulkError) => {
          services.logger.log(
            `Hydration finished. ${e.failures.length} artists were not added because they were already registered.`
          );
        });
    }),
    ignoreElements()
  );
};
