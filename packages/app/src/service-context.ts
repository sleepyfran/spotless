import { createContext, useContext } from "react";
import {
  AppConfig,
  AppState,
  SpotifyAuthService,
  LocalStorage,
} from "@spotless/core";

interface IServiceContext {
  authService: SpotifyAuthService;
  state: AppState;
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
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);
