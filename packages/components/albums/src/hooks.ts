import { AlbumsData } from "@spotless/data-albums";
import { Album, Artist } from "@spotless/types";
import { bind } from "@react-rxjs/core";
import { map } from "rxjs";
import { useData } from "@spotless/components-shared";

type AlbumResponse = [Album | undefined, boolean];
type AlbumsResponse = [Album[], boolean];

const loadingAlbum = [undefined, true] as AlbumResponse;
const loadingAlbums = [[], true] as AlbumsResponse;
const mapToAlbumResponse = map(
  (album: Album | undefined) => [album, false] as AlbumResponse
);
const mapToAlbumsResponse = map(
  (albums: Album[]) => [albums, false] as AlbumsResponse
);

const [albumDetail$] = bind(
  (albums: AlbumsData, id: string) =>
    albums.albumDetail(id).pipe(mapToAlbumResponse),
  loadingAlbum
);
const [allAlbums$] = bind(
  (albums: AlbumsData, filter?: string) =>
    albums.allAlbumsByName(filter).pipe(mapToAlbumsResponse),
  loadingAlbums
);
const [nAlbums$] = bind(
  <K extends keyof Album>(albums: AlbumsData, n: number, orderBy?: K) =>
    albums.fetchN(n, orderBy).pipe(mapToAlbumsResponse),
  loadingAlbums
);
const [artistAlbums$] = bind(
  (albums: AlbumsData, artist: Artist) => albums.allAlbumsByArtist(artist),
  undefined
);

/**
 * Hook that fetches the details of a specific album by its ID. Decorates each
 * observable response with a type to indicate if we're loading or if we've
 * finished loading.
 */
export const useAlbum = (id: string) => {
  const { albums } = useData();
  return albumDetail$(albums, id);
};

/**
 * Hook that fetches all the albums in the user's library. Decorates each
 * observable response with a type to indicate if we're loading or if we've
 * finished loading.
 */
export const useAllAlbums = (filter?: string) => {
  const { albums } = useData();
  return allAlbums$(albums, filter);
};

/**
 * Hook that fetches the first `n` albums in the user's library, ordered by
 * a specific field. Decorates each observable response with a type to indicate
 * if we're loading or if we've finished loading.
 */
export const useAlbums = <K extends keyof Album>(n: number, orderBy?: K) => {
  const { albums } = useData();
  return nAlbums$(albums, n, orderBy);
};

/**
 * Hook that fetches all the albums in the user's library by a specific artist.
 */
export const useArtistAlbums = (artist: Artist) => {
  const { albums } = useData();
  return artistAlbums$(albums, artist);
};
