import { createContext, useContext } from "react";
import { AppConfig } from "@spotless/types";
import {
  MainServices,
  Data,
  initializeMainServices,
} from "@spotless/services-bootstrap";

type IServiceContext = Omit<MainServices, "api" | "db">;

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
  const { services, data } = initializeMainServices(appConfig);

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
