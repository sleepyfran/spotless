import { createContext, useContext } from "react";
import { AppConfig } from "@spotless/types";
import { AuthService } from "@spotless/services-auth";
import { ConsoleLogger } from "@spotless/services-logger";

interface IServiceContext {
  authService: AuthService;
}

/**
 * Contains all the services available to perform actions in the app.
 */
export const ServiceContext = createContext<IServiceContext>(undefined as any);

export const initialize = async (appConfig: AppConfig) => {
  const logger = new ConsoleLogger();
  const authService = new AuthService(appConfig, logger);
  await authService.initAuthState();

  return {
    authService,
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);
