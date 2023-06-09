import { AlbumsData } from "@spotless/data-albums";
import { PlayArtistDiscographyMode } from "@spotless/services-player";
import { Single, singleFrom } from "@spotless/services-rx";
import { Album, Artist } from "@spotless/types";
import { concatMap, map } from "rxjs";

type DiscographyDeps = {
  albumsData: AlbumsData;
  playMultiple: (items: Album[]) => Single<void>;
  shuffle: (items: Album[]) => Single<void>;
};

export const playDiscography = (
  { albumsData, playMultiple, shuffle }: DiscographyDeps,
  artist: Artist,
  mode: PlayArtistDiscographyMode
) =>
  singleFrom(albumsData.allAlbumsByArtist(artist)).pipe(
    map((albums) =>
      mode === PlayArtistDiscographyMode.FromOldest ? albums.reverse() : albums
    ),
    concatMap(
      mode === PlayArtistDiscographyMode.Shuffled ? shuffle : playMultiple
    )
  );
