import { ArtistsData } from "@spotless/data-artists";
import { Artist } from "@spotless/types";
import { bind } from "@react-rxjs/core";
import { map } from "rxjs";
import { useData } from "@spotless/components-shared";

type ArtistsResponse = [Artist[], boolean];

const loading = [[], true] as ArtistsResponse;
const mapToResponse = map(
  (artists: Artist[]) => [artists, false] as ArtistsResponse
);

const [allArtists$] = bind(
  (artists: ArtistsData, filter?: string) =>
    artists.allArtistsByName(filter).pipe(mapToResponse),
  loading
);

/**
 * Hook that fetches all the artists in the user's library. Decorates each
 * observable response with a type to indicate if we're loading or if we've
 * finished loading.
 */
export const useAllArtists = (filter?: string) => {
  const { artists } = useData();
  return allArtists$(artists, filter);
};
