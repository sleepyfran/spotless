import { GenreDataSource } from "@spotless/data-genres";
import { singleFrom } from "@spotless/services-rx";
import { Album, Genre, IndexedGenre } from "@spotless/types";
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
  timer,
} from "rxjs";
import { BulkError, Database } from "@spotless/data-db";
import { Logger, LoggerFactory } from "@spotless/services-logger";
import { AlbumsData } from "@spotless/data-albums";

const DEFAULT_DELAY_IN_MS = 3000;

export class GenreHydrator {
  private logger: Logger;

  constructor(
    private readonly db: Database,
    private readonly albumsData: AlbumsData,
    private readonly genresSource: GenreDataSource,
    createLogger: LoggerFactory
  ) {
    this.logger = createLogger("GenreHydrator");
  }

  /**
   * Subscribes to all changes on the album collection and retrieves the genres
   * for each of the albums using a genre data source.
   */
  public startOnAlbumChanges() {
    return this.albumsData
      .fetch({
        orderBy: {
          key: "addedAt",
          direction: "desc",
        },
      })
      .pipe(
        mergeAll(1),
        concatMap((album) =>
          this.hydrateAlbumIfOutdated(album).pipe(delay(DEFAULT_DELAY_IN_MS))
        )
      );
  }

  private hydrateAlbumIfOutdated(album: Album): Observable<Album> {
    if (album.genres.length > 0) {
      this.logger.log(
        "Album already has genres assigned, skipping...",
        album.name
      );
      return EMPTY;
    }

    this.logger.log("Starting genre hydration for album", album.name);
    return this.hydrateAlbumGenre(album);
  }

  private hydrateAlbumGenre(album: Album): Observable<Album> {
    return this.genresSource.retrieveAllForAlbum(album).pipe(
      concatMap((genres) =>
        forkJoin([
          this.updateAlbumGenres(album, genres),
          this.saveGenres(genres),
        ])
      ),
      map(() => album),
      catchError((e) => {
        this.logger.error(
          "Error while fetching album genres, waiting until continuing...",
          e
        );
        return timer(DEFAULT_DELAY_IN_MS).pipe(mergeMap(() => EMPTY));
      })
    );
  }

  private updateAlbumGenres(album: Album, genres: Genre[]) {
    return singleFrom(
      this.db.albums.update(album, {
        genres,
      })
    );
  }

  private saveGenres(genres: Genre[]) {
    return singleFrom(
      this.db.genres.bulkPut(
        genres.map(
          (genre) =>
            ({
              name: genre,
            } as IndexedGenre)
        )
      )
    ).pipe(
      catchError((e: BulkError) => {
        this.logger.warn(
          "Some genres were already present in the database, skipped and delaying until continuing...",
          e.failures.length
        );
        return timer(DEFAULT_DELAY_IN_MS);
      })
    );
  }
}
