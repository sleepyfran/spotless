import { createContext, useContext } from "react";
import { AppConfig } from "@spotless/types";
import {
  Services,
  Data,
  initialize as bootstrap,
} from "@spotless/services-bootstrap";

type IServiceContext = Pick<Services, "authService">;

type IDataContext = Data;

/**
 * Contains all the services available to perform actions in the app.
 */
export const ServiceContext = createContext<IServiceContext>(
  undefined as never
);

/**
 * Contains all data packages available to perform queries in the app.
 */
export const DataContext = createContext<IDataContext>(undefined as never);

export const initialize = (
  appConfig: AppConfig
): { services: IServiceContext; data: IDataContext } => {
  const { services, data } = bootstrap("main", appConfig);

  return {
    services,
    data,
  };
};

/**
 * Exposes all services available to perform actions in the app.
 */
export const useServices = () => useContext(ServiceContext);

/**
 * Exposes all data packages available to perform queries in the app.
 */
export const useData = () => useContext(DataContext);
