import { beforeEach, describe, test, it, expect } from "@jest/globals";
import { Mock, It, Times } from "moq.ts";
import { GenreHydrator } from "./genre-hydration";
import { Album, Genre, IndexedGenre } from "@spotless/types";
import { AlbumsData } from "@spotless/data-albums";
import { Database, BulkError, FetchOptions } from "@spotless/data-db";
import { GenreDataSource } from "@spotless/data-genres";
import { of, throwError } from "rxjs";
import { TestScheduler } from "rxjs/testing";
import { Logger } from "@spotless/services-logger";
import { isEqual } from "lodash";

const createDbMock = () => {
  const mock = new Mock<Database>();

  /* 
  We make this return an observable because the test scheduler does not
  support promises.
  */
  mock
    .setup((instance) => instance.albums.update(It.IsAny(), It.IsAny()))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .returns(of(1) as unknown as any);

  mock
    .setup((instance) => instance.genres.bulkPut(It.IsAny()))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .returns(of(1) as unknown as any);

  return mock;
};

const createAlbumsDataMock = () => {
  return new Mock<AlbumsData>();
};

const createGenresSourceMock = () => {
  return new Mock<GenreDataSource>();
};

const createLoggerMock = () => {
  const mock = new Mock<Logger>();

  mock.setup((instance) => instance.log(It.IsAny())).returns();
  mock.setup((instance) => instance.warn(It.IsAny())).returns();
  mock.setup((instance) => instance.error(It.IsAny())).returns();

  return mock;
};

describe("Genre hydrator", () => {
  let dbMock: Mock<Database>;
  let albumsDataMock: Mock<AlbumsData>;
  let genresSourceMock: Mock<GenreDataSource>;
  let loggerMock: Mock<Logger>;

  const resetMocks = () => {
    dbMock = createDbMock();
    albumsDataMock = createAlbumsDataMock();
    genresSourceMock = createGenresSourceMock();
    loggerMock = createLoggerMock();
  };

  const mockReturnedAlbums = (albums: Album[]) => {
    albumsDataMock
      .setup((instance) => instance.fetch(It.IsAny()))
      .returns(of(albums));
  };

  const mockReturnedGenres = (genres: Genre[]) => {
    genresSourceMock
      .setup((instance) => instance.retrieveAllForAlbum(It.IsAny()))
      .returns(of(genres));
  };

  const mockErroredGenres = (error: Error) => {
    genresSourceMock
      .setup((instance) => instance.retrieveAllForAlbum(It.IsAny()))
      .returns(throwError(() => error));
  };

  const createHydrator = () => {
    return new GenreHydrator(
      dbMock.object(),
      albumsDataMock.object(),
      genresSourceMock.object(),
      () => loggerMock.object()
    );
  };

  const setupScheduler = () => {
    return new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  };

  beforeEach(resetMocks);

  test("should subscribe to all albums ordered by latest", () => {
    const testScheduler = setupScheduler();

    mockReturnedAlbums([]);
    mockReturnedGenres([]);
    const hydrator = createHydrator();

    testScheduler.run(({ expectObservable, flush }) => {
      expectObservable(hydrator.startOnAlbumChanges());
      flush();

      albumsDataMock.verify(
        (instance) =>
          instance.fetch(
            It.Is<FetchOptions<Album>>((opts) =>
              isEqual(opts.orderBy, {
                key: "addedAt",
                direction: "desc",
              })
            )
          ),
        Times.Once()
      );
    });
  });

  describe("when an album already has genres", () => {
    beforeEach(resetMocks);

    it("ignores the album", () => {
      expect.assertions(1);

      const testScheduler = setupScheduler();

      mockReturnedAlbums([
        {
          name: "Fake Album",
          genres: ["rock"],
        } as Album,
      ]);
      mockReturnedGenres([]);
      const hydrator = createHydrator();

      testScheduler.run(({ expectObservable }) => {
        // We expect no values to be emitted (aka | end of stream).
        expectObservable(hydrator.startOnAlbumChanges()).toBe("|");
      });
    });
  });

  describe("when an album does not have genres", () => {
    beforeEach(resetMocks);

    it("updates the album's genres to the ones fetched", () => {
      expect.assertions(0);

      const testScheduler = setupScheduler();

      const album = {
        name: "Fake Album",
        genres: [] as Genre[],
      } as Album;

      mockReturnedAlbums([album]);
      mockReturnedGenres(["rock"]);
      const hydrator = createHydrator();

      testScheduler.run(({ expectObservable, flush }) => {
        expectObservable(hydrator.startOnAlbumChanges());
        flush();

        dbMock.verify(
          (instance) =>
            instance.albums.update(
              album,
              It.Is<{ genres: Genre[] }>((obj) => isEqual(obj.genres, ["rock"]))
            ),
          Times.Once()
        );
      });
    });

    test("processes each album with a delay in between them", () => {
      expect.assertions(1);

      const testScheduler = setupScheduler();

      const albums = new Array(4).fill(0).map(
        (_, i) =>
          ({
            name: `Fake Album ${i}`,
            genres: [] as Genre[],
          } as Album)
      );

      mockReturnedAlbums(albums);
      mockReturnedGenres(["rock"]);
      const hydrator = createHydrator();

      testScheduler.run(({ expectObservable }) => {
        /*
        Emits each album with a 3000ms delay between them and completes after
        emitting the last one.
         */
        const marbles = "3000ms a 2999ms b 2999ms c 2999ms (d|)";
        const values = {
          a: albums[0],
          b: albums[1],
          c: albums[2],
          d: albums[3],
        };

        expectObservable(hydrator.startOnAlbumChanges()).toBe(marbles, values);
      });
    });

    describe("and the genres haven't been previously added", () => {
      beforeEach(resetMocks);

      it("adds the genres to the database", () => {
        const testScheduler = setupScheduler();

        const fakeAlbum = {
          name: "Fake Album",
          genres: [] as Genre[],
        } as Album;

        mockReturnedAlbums([fakeAlbum]);
        mockReturnedGenres(["rock"]);
        const hydrator = createHydrator();

        testScheduler.run(({ expectObservable, flush }) => {
          expectObservable(hydrator.startOnAlbumChanges());
          flush();

          dbMock.verify(
            (instance) =>
              instance.genres.bulkPut(
                It.Is<IndexedGenre[]>((genres) =>
                  isEqual(genres, [{ name: "rock" } as IndexedGenre])
                )
              ),
            Times.Once()
          );
        });
      });
    });

    describe("if the genres have already been added", () => {
      beforeEach(resetMocks);

      it("does not error and delays the next item", () => {
        expect.assertions(1);

        const testScheduler = setupScheduler();

        mockReturnedAlbums([
          {
            name: "Fake Album with already added genres",
            genres: [] as Genre[],
          } as Album,
        ]);
        mockErroredGenres(new Error("error") as BulkError);
        const hydrator = createHydrator();

        testScheduler.run(({ expectObservable }) => {
          expectObservable(hydrator.startOnAlbumChanges()).toBe("3000ms |");
        });
      });

      it("keeps processing afterwards", () => {
        expect.assertions(1);

        const testScheduler = setupScheduler();

        const errorAlbum = {
          name: "Fake Album with already added genres",
          genres: [] as Genre[],
        } as Album;

        const regularAlbum = {
          name: "The one after the error",
          genres: [] as Genre[],
        } as Album;

        mockReturnedAlbums([errorAlbum, regularAlbum]);
        genresSourceMock
          .setup((instance) => instance.retrieveAllForAlbum(errorAlbum))
          .returns(throwError(() => "error"));

        genresSourceMock
          .setup((instance) => instance.retrieveAllForAlbum(regularAlbum))
          .returns(of(["rock"]));

        const hydrator = createHydrator();

        testScheduler.run(({ expectObservable }) => {
          const marbles = "6000ms (a|)";
          const values = {
            a: regularAlbum,
          };
          expectObservable(hydrator.startOnAlbumChanges()).toBe(
            marbles,
            values
          );
        });
      });
    });
  });

  test("should have a delay before continuing if retrieving genres failed", () => {
    expect.assertions(1);

    const testScheduler = setupScheduler();

    mockReturnedAlbums([
      {
        name: "Fake Album with genre retrieval error",
        genres: [] as Genre[],
      } as Album,
    ]);
    mockErroredGenres(new Error("error"));
    const hydrator = createHydrator();

    testScheduler.run(({ expectObservable }) => {
      expectObservable(hydrator.startOnAlbumChanges()).toBe("3000ms |");
    });
  });
});
