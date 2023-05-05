import { Single } from "@spotless/services-rx";
import { Api } from "@spotless/data-api";
import { ConnectionStatus } from "./types";
import { EMPTY, concatMap, ignoreElements } from "rxjs";
import { Logger } from "@spotless/services-logger";

type TransferDeps = {
  api: Api;
  connectionStatus: ConnectionStatus;
  logger: Logger;
};

/**
 * Transfers the playback to the current device if it's connected and there's
 * no other active playback in another device. If `force` is provided then
 * the playback will be transferred even if there's another active playback
 * in another device. After transferring the playback, it will disable shuffle
 * and repeat.
 */
export const transfer = (
  { api, connectionStatus, logger }: TransferDeps,
  force?: boolean
): Single<void> => {
  if (connectionStatus.__status !== "connected") {
    return EMPTY;
  }

  const currentDeviceId = connectionStatus.deviceId;
  const transferPlayback = api.client
    .put("/me/player", {
      device_ids: [currentDeviceId],
    })
    .pipe(
      concatMap(() =>
        api.client.put(
          `/me/player/shuffle?state=false&device_id=${connectionStatus.deviceId}`,
          {}
        )
      ),
      concatMap(() =>
        api.client.put(
          `/me/player/repeat?state=off&device_id=${connectionStatus.deviceId}`,
          {}
        )
      ),
      ignoreElements()
    );

  if (force) {
    return transferPlayback;
  }

  return api.client.get<SpotifyApi.CurrentPlaybackResponse>("/me/player").pipe(
    concatMap((playbackState) => {
      const playingInAnotherDevice =
        playbackState.is_playing && playbackState.device.id !== currentDeviceId;
      if (playingInAnotherDevice) {
        // We don't want to interrupt the playback in another device.
        logger.log(
          "User is playing in another device, skipping playback transfer"
        );
        return EMPTY;
      }

      logger.log("Transferring playback to current device");
      return transferPlayback;
    }),
    ignoreElements()
  );
};
