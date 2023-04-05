import { createContext, useContext } from "react";
import { AppConfig } from "@spotless/types";
import { AuthService } from "@spotless/services-auth";
import { SpotifyApi } from "@spotless/services-api";
import { AlbumsService, albumCacheKeys } from "@spotless/services-albums";
import { ArtistsService, artistCacheKeys } from "@spotless/services-artists";
import { ConsoleLogger } from "@spotless/services-logger";

interface IServiceContext {
  cacheKeys: typeof albumCacheKeys & typeof artistCacheKeys;
  artistsService: ArtistsService;
  albumsService: AlbumsService;
  authService: AuthService;
}

/**
 * Contains all the services available to perform actions in the app.
 */
export const ServiceContext = createContext<IServiceContext>(
  undefined as never
);

export const initialize = async (
  appConfig: AppConfig
): Promise<IServiceContext> => {
  const logger = new ConsoleLogger();
  const authService = new AuthService(appConfig, logger);
  await authService.initAuthState();

  const api = new SpotifyApi(authService);
  const albumsService = new AlbumsService(api);
  const artistsService = new ArtistsService(api);

  return {
    cacheKeys: { ...albumCacheKeys, ...artistCacheKeys },
    artistsService,
    albumsService,
    authService,
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);
