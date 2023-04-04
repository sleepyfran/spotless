import { createContext, useContext } from "react";
import { AppConfig } from "@spotless/types";
import { AuthService } from "@spotless/services-auth";

interface IServiceContext {
  authService: AuthService;
}

/**
 * Contains all the services available to perform actions in the app.
 */
export const ServiceContext = createContext<IServiceContext>(undefined as any);

export const initialize = async (appConfig: AppConfig) => {
  const authService = new AuthService(appConfig);
  await authService.initAuthState();

  return {
    authService,
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);
