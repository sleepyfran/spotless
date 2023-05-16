import { Data, initializeWorkerServices } from "@spotless/services-bootstrap";
import { GenreDataSource } from "@spotless/data-genres";
import { Single, singleFrom } from "@spotless/services-rx";
import { Album, AppConfig, Genre, IndexedGenre } from "@spotless/types";
import {
  EMPTY,
  Observable,
  catchError,
  concatMap,
  delay,
  forkJoin,
  map,
  mergeAll,
  mergeMap,
  throwError,
  timer,
} from "rxjs";
import { BulkError, Database } from "@spotless/data-db";
import { Logger } from "@spotless/services-logger";

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

const DEFAULT_DELAY_IN_MS = 3000;
const TWO_MINUTES_IN_MS = 2 * 60 * 1000;

const initializeAndStartHydration = (appConfig: AppConfig) => {
  const { services, data } = initializeWorkerServices(appConfig);
  const logger = services.createLogger("GenresWorker");

  data.auth
    .authenticatedUser()
    .pipe(
      delay(
        TWO_MINUTES_IN_MS
      ) /* Give a chance to the population of albums to finish. */,
      concatMap(() => hydrateOnAlbumChanges(data, logger))
    )
    .subscribe({
      next: (album) =>
        logger.log("Genre hydration completed for album", album.name),
      error: (e) => logger.error("Error while hydrating genres", e),
      complete: () => logger.log("Genre hydration complete"),
    });
};

const hydrateOnAlbumChanges = (data: Data, logger: Logger): Observable<Album> =>
  data.albums
    .fetch({
      orderBy: {
        key: "addedAt",
        direction: "desc",
      },
    })
    .pipe(
      mergeAll(1),
      concatMap((album) =>
        tryHydrateAlbumGenres(data.genresSource, data.db, album, logger).pipe(
          delay(DEFAULT_DELAY_IN_MS)
        )
      )
    );

const tryHydrateAlbumGenres = (
  genres: GenreDataSource,
  db: Database,
  album: Album,
  logger: Logger
) => {
  if (album.genres.length > 0) {
    logger.log("Album already has genres assigned, skipping...", album.name);
    return EMPTY;
  }

  logger.log("Starting genre hydration for album", album.name);
  return hydrateAlbumGenre(genres, db, album, logger);
};

const hydrateAlbumGenre = (
  genres: GenreDataSource,
  db: Database,
  album: Album,
  logger: Logger
): Single<Album> =>
  genres.retrieveAllForAlbum(album).pipe(
    concatMap((genres) =>
      forkJoin([
        updateAlbumGenres(db, album, genres),
        saveGenres(db, genres, logger),
      ])
    ),
    map(() => album),
    catchError((e) => {
      logger.error(
        "Error while fetching album genres, waiting until continuing...",
        e
      );
      return timer(DEFAULT_DELAY_IN_MS).pipe(
        mergeMap(() => throwError(() => e))
      );
    })
  );

const updateAlbumGenres = (
  db: Database,
  album: Album,
  genres: Genre[]
): Single<number> => {
  return singleFrom(
    db.albums.update(album, {
      genres,
    })
  );
};

const saveGenres = (
  db: Database,
  genres: Genre[],
  logger: Logger
): Single<unknown> => {
  return singleFrom(
    db.genres.bulkPut(
      genres.map(
        (genre) =>
          ({
            name: genre,
          } as IndexedGenre)
      )
    )
  ).pipe(
    catchError((e: BulkError) => {
      logger.warn(
        "Some genres were already present in the database, skipped and delaying until continuing...",
        e.failures.length
      );
      return timer(DEFAULT_DELAY_IN_MS);
    })
  );
};
