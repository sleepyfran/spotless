import { AuthData } from "@spotless/data-auth";
import { Api, ApiClient } from "@spotless/data-api";
import { createUserLibraryApi } from "./src/user-library";
import { createPlayerApi } from "./src/player";

const BASE_URL = "https://api.spotify.com/v1";

/**
 * Creates the implementation of the API interface for Spotify.
 */
export const createSpotifyApi = (authData: AuthData): Api => {
  const client = new ApiClient(BASE_URL, authData);

  return {
    client,
    userLibrary: createUserLibraryApi(client),
    player: createPlayerApi(client),
  };
};
