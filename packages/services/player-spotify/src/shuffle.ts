import { PlayerData } from "@spotless/data-player";
import { Single } from "@spotless/services-rx";
import { Album, AlbumMappers } from "@spotless/types";
import { shuffle } from "lodash";
import { EMPTY, finalize } from "rxjs";

type ShuffleAlbumsDeps = {
  playerState: PlayerData;
  play: (item: Album) => Single<void>;
};

export const shuffleAlbums = (
  { playerState, play }: ShuffleAlbumsDeps,
  items: Album[]
) => {
  if (items.length === 0) {
    return EMPTY;
  }

  const shuffledAlbums = shuffle(items);
  return play(shuffledAlbums[0]).pipe(
    finalize(() => {
      // Append the rest of the albums to the queue.
      playerState.addToQueue(
        shuffledAlbums.slice(1).flatMap(AlbumMappers.albumToQueuedAlbum)
      );
    })
  );
};
