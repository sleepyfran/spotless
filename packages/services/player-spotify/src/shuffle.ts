import { Single } from "@spotless/services-rx";
import { Album } from "@spotless/types";
import { shuffle } from "lodash";
import { EMPTY } from "rxjs";

type ShuffleAlbumsDeps = {
  playMultiple: (items: Album[]) => Single<void>;
};

export const shuffleAlbums = (
  { playMultiple }: ShuffleAlbumsDeps,
  items: Album[]
) => {
  if (items.length === 0) {
    return EMPTY;
  }

  const shuffledAlbums = shuffle(items);
  return playMultiple(shuffledAlbums);
};
