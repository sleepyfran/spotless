import { PlayerData } from "@spotless/data-player";
import { Single } from "@spotless/services-rx";
import { Album, AlbumMappers } from "@spotless/types";
import { shuffle, drop } from "lodash";
import { EMPTY, tap } from "rxjs";

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
    tap(() => {
      // Append the rest of the albums to the queue.
      playerState.addToQueue(
        drop(shuffledAlbums, 1).flatMap(AlbumMappers.albumToQueuedAlbum)
      );
    })
  );
};
