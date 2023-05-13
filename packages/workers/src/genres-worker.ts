import {
  Data,
  WorkerServices,
  initializeWorkerServices,
} from "@spotless/services-bootstrap";
import { GenreDataSource } from "@spotless/data-genres";
import { Single } from "@spotless/services-rx";
import { Album, AppConfig } from "@spotless/types";
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  delay,
  map,
  mergeAll,
} from "rxjs";
import { Database } from "@spotless/data-db";
import { Logger } from "@spotless/services-logger";

export type InitWorkerMessage = {
  __type: "init";
  appConfig: AppConfig;
};

export type WorkerMessage = InitWorkerMessage;

self.onmessage = async (event: MessageEvent<InitWorkerMessage>) => {
  const { data: eventData } = event;

  switch (eventData.__type) {
    case "init":
      await initializeAndStartHydration(eventData.appConfig);
      break;
    default:
      console.error("Unrecognized message sent to albums worker", event);
      break;
  }
};

const initializeAndStartHydration = (appConfig: AppConfig) => {
  const { services, data } = initializeWorkerServices(appConfig);
  const logger = services.createLogger("GenresWorker");

  data.auth
    .authenticatedUser()
    .pipe(concatMap(() => hydrateOnAlbumChanges(data, services, logger)))
    .subscribe({
      next: (album) =>
        logger.log(
          "Genre hydration for album finished successfully",
          album.name
        ),
      complete: () => logger.log("Genre hydration complete"),
    });
};

const hydrateOnAlbumChanges = (
  data: Data,
  services: WorkerServices,
  logger: Logger
): Observable<Album> =>
  data.albums.allAlbumsByName().pipe(
    mergeAll(),
    concatMap((album) => {
      if (album.genres.length > 0) {
        logger.log(
          "Album already has genres assigned, skipping...",
          album.name
        );
        return EMPTY;
      }

      logger.log("Starting genre hydration for album", album.name);
      return hydrateAlbumGenre(data.genresSource, services.db, album).pipe(
        delay(3000),
        catchError((e) => {
          logger.error("Error while hydrating genres for album", album.name, e);
          return EMPTY;
        })
      );
    })
  );

const hydrateAlbumGenre = (
  genres: GenreDataSource,
  db: Database,
  album: Album
): Single<Album> =>
  genres.retrieveAllForAlbum(album).pipe(
    concatMap((genres) =>
      db.albums.update(album, {
        genres,
      })
    ),
    map(() => album)
  );
