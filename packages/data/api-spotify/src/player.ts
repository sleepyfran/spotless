import { ApiClient, PlayerApi } from "@spotless/data-api";

export const createPlayerApi = (client: ApiClient): PlayerApi => ({
  play: (id) =>
    client.put("/me/player/play", {
      context_uri: `spotify:album:${id}`,
      position_ms: 0,
    }),
});
