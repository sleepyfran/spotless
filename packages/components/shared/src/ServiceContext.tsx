import { createContext, useContext } from "react";
import { AppConfig } from "@spotless/types";
import { AuthService } from "@spotless/services-auth";
import { Api, SpotifyApi } from "@spotless/services-api";
import { ConsoleLogger } from "@spotless/services-logger";

interface IServiceContext {
  authService: AuthService;
  api: Api;
}

/**
 * Contains all the services available to perform actions in the app.
 */
export const ServiceContext = createContext<IServiceContext>(
  undefined as never
);

export const initialize = async (appConfig: AppConfig) => {
  const logger = new ConsoleLogger();
  const authService = new AuthService(appConfig, logger);
  await authService.initAuthState();

  const api = new SpotifyApi(authService);

  return {
    authService,
    api,
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);
