import { createContext, useContext } from "react";
import { AppState } from "@spotless/core-state";
import { AppConfig } from "@spotless/core-types";
import { LocalStorage } from "@spotless/core-storage";
import { PlayerService } from "@spotless/core-player";
import { SpotifyAuthService } from "@spotless/core-auth";

interface IServiceContext {
  authService: SpotifyAuthService;
  state: AppState;
  playerService: PlayerService;
}

/**
 * Contains all the services available to perform actions in the app.
 */
export const ServiceContext = createContext<IServiceContext>(undefined as any);

export const initialize = (appConfig: AppConfig): IServiceContext => {
  const localStorage = new LocalStorage();
  const appState = new AppState(localStorage);

  return {
    authService: new SpotifyAuthService(appState, appConfig),
    state: appState,
    playerService: new PlayerService(appState),
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);
