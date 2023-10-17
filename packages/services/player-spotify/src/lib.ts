import { Logger } from "@spotless/services-logger";

type LibDeps = {
  logger: Logger;
};

/**
 * Attempts to load the Spotify SDK, logging the result.
 */
export const loadSpotifyPlaybackLib = ({ logger }: LibDeps) => {
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;
  script.onload = () => logger.log("Spotify SDK loaded");
  script.onerror = () => {
    logger.error("Spotify SDK failed to load");
  };
  document.body.appendChild(script);
};
