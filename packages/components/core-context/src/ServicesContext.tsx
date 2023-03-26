import { createContext, useContext } from "react";
import { AppState } from "@spotless/core-state";
import { AppConfig } from "@spotless/core-types";
import { LocalStorage } from "@spotless/core-storage";
import { PlayerService } from "@spotless/core-player";
import { AuthService } from "@spotless/core-auth";

interface IServiceContext {
  authService: AuthService;
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
  const authService = new AuthService(appState, appConfig);

  return {
    authService,
    state: appState,
    playerService: new PlayerService(appState, authService),
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);
