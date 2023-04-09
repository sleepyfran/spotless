import { AppConfig } from "@spotless/types";
import { initHydration } from "./workers.common";

export type InitWorkerMessage = {
  __type: "init";
  appConfig: AppConfig;
};

export type WorkerMessage = InitWorkerMessage;

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data } = event;

  switch (data.__type) {
    case "init":
      await initHydration(data.appConfig, (services) => {
        return services.artistsService.hydrateDatabase();
      });
      break;
    default:
      console.error("Unrecognized message sent to artists worker", event);
      break;
  }
};
