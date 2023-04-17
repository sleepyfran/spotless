import { ApiClient, PlayerApi } from "@spotless/data-api";

export const createPlayerApi = (client: ApiClient): PlayerApi => ({
  play: (item) =>
    client.put("/me/player/play", {
      context_uri: `spotify:album:${item.id}`,
      position_ms: 0,
    }),
  setShuffle: (state) => client.put(`/me/player/shuffle?state=${state}`, {}),
  transferPlayback: (deviceId) =>
    client.put("/me/player", {
      device_ids: [deviceId],
    }),
});
