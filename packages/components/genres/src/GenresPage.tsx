import { Flex, Loader, NavLink, Text } from "@mantine/core";
import { PageLayout, useData } from "@spotless/components-shared";
import { AlbumGrid } from "@spotless/components-albums";
import { Album, Genre, IndexedGenre } from "@spotless/types";
import { GenresData } from "@spotless/data-genres";
import { map } from "rxjs";
import { bind } from "@react-rxjs/core";
import { useState } from "react";
import { AlbumsData } from "@spotless/data-albums";

type Response<T> = [T[], boolean];

const loading = [[], true];

const [allGenres$] = bind(
  (genres: GenresData, filter?: string) =>
    genres
      .filtered({
        filter: filter || "",
        filterField: "name",
      })
      .pipe(map((genres) => [genres, false] as Response<IndexedGenre>)),
  loading as Response<IndexedGenre>
);

const [genreAlbums$] = bind(
  (albums: AlbumsData, genre: Genre) =>
    albums
      .allAlbumsOfGenre(genre)
      .pipe(map((albums) => [albums, false] as Response<Album>)),
  loading as Response<Album>
);

/**
 * Hook that fetches all the genres in the user's library. Decorates each
 * observable response with a type to indicate if we're loading or if we've
 * finished loading.
 */
export const useAllGenres = (filter?: string) => {
  const { genres } = useData();
  return allGenres$(genres, filter);
};

/**
 * Hook that fetches all the albums in the user's library that are associated
 * with the given genre. Decorates each observable response with a type to
 * indicate if we're loading or if we've finished loading.
 */
export const useGenreAlbums = (genre: Genre) => {
  const { albums } = useData();
  return genreAlbums$(albums, genre);
};

/**
 * Component that displays a navigation page for genres, showing the albums
 * associated with the currently selected one.
 */
export const GenresPage = () => {
  const [genres, isLoading] = useAllGenres();
  const [selectedGenre, setSelectedGenre] = useState<IndexedGenre | undefined>(
    undefined
  );

  return (
    <PageLayout isLoading={isLoading} title="Genres">
      <Flex>
        <Flex
          w={300}
          h="30rem"
          direction="column"
          mah="100%"
          style={{ overflow: "auto" }}
        >
          {genres.map((genre) => (
            <NavLink
              label={genre.name}
              key={genre.id}
              active={selectedGenre?.id === genre.id}
              onClick={() => setSelectedGenre(genre)}
            ></NavLink>
          ))}
        </Flex>

        {selectedGenre ? (
          <GenreAlbums genre={selectedGenre.name} />
        ) : (
          <Text fw="lighter">
            Genre fetching is done in the background and slowly to not overload
            MusicBrainz&apos;s services, so it might take a while until you see
            all the genres in your library.
          </Text>
        )}
      </Flex>
    </PageLayout>
  );
};

const GenreAlbums = ({ genre }: { genre: Genre }) => {
  const [albums, loading] = useGenreAlbums(genre);

  return loading ? <Loader /> : <AlbumGrid albums={albums} />;
};
