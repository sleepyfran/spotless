import { Single, singleFrom, singleOf } from "@spotless/services-rx";
import { catchError, map } from "rxjs";

type VolumeDeps = {
  player?: Spotify.Player;
};

/**
 * Attempts to retrieve the volume of the player. If no player is available, it
 * defaults to 50.
 */
export const getVolume = ({ player }: VolumeDeps): Single<number> => {
  const defaultVolume = 50;

  if (!player) {
    return singleOf(defaultVolume);
  }

  return singleFrom(player.getVolume()).pipe(
    map((volume) => volume * 100),
    catchError(() => singleOf(defaultVolume))
  );
};
