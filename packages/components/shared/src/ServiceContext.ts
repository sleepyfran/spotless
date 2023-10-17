import { createContext, useContext } from "react";
import { AppConfig } from "@spotless/types";
import {
  MainServices,
  SpotifyServices,
  Data,
  initializeMainServices,
} from "@spotless/services-bootstrap";
import { SpotifyPlayer } from "@spotless/services-player-spotify";

type IServiceContext = Omit<MainServices, "api" | "db">;
type IBackendSpecificServiceContext = {
  spotify: SpotifyServices;
};

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
 * Exposes a set of services that are backend specific.
 * @param backend The backend to retrieve.
 */
export const useBackendSpecificServices = <
  Backend extends keyof IBackendSpecificServiceContext
>(
  backend: Backend
): IBackendSpecificServiceContext[Backend] => {
  const { player } = useContext(ServiceContext);
  const backendSpecificServices: IBackendSpecificServiceContext = {
    spotify: {
      player: player as SpotifyPlayer,
    },
  };

  return {
    player: backendSpecificServices[backend].player,
  };
};

/**
 * Exposes all data packages available to perform queries in the app.
 */
export const useData = () => useContext(DataContext);
