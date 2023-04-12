import { AlbumsData } from "@spotless/data-albums";
import { Album } from "@spotless/types";
import { bind } from "@react-rxjs/core";
import { map } from "rxjs";

type AlbumsResponse = [Album[], boolean];

const loading = [[], true] as AlbumsResponse;
const mapToResponse = map(
  (albums: Album[]) => [albums, false] as AlbumsResponse
);

const [allAlbums$] = bind(
  (albums: AlbumsData) => albums.allAlbumsByName().pipe(mapToResponse),
  loading
);
const [nAlbums$] = bind(
  <K extends keyof Album>(albums: AlbumsData, n: number, orderBy?: K) =>
    albums.fetchN(n, orderBy).pipe(mapToResponse),
  loading
);

/**
 * Hook that fetches all the albums in the user's library. Decorates each
 * observable response with a type to indicate if we're loading or if we've
 * finished loading.
 */
export const useAllAlbums = (albums: AlbumsData) => allAlbums$(albums);

/**
 * Hook that fetches the first `n` albums in the user's library, ordered by
 * a specific field. Decorates each observable response with a type to indicate
 * if we're loading or if we've finished loading.
 */
export const useAlbums = <K extends keyof Album>(
  albums: AlbumsData,
  n: number,
  orderBy?: K
) => nAlbums$(albums, n, orderBy);
