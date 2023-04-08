import { Services, Data, initialize } from "@spotless/services-bootstrap";
import { AppConfig } from "@spotless/types";
import { finalize, throwError, timeout } from "rxjs";

export type InitWorkerMessage = {
  __type: "init";
  appConfig: AppConfig;
};

export type WorkerMessage = InitWorkerMessage;

let serviceContext: Services | null = null;
let dataContext: Data | null = null;
let hydrationInterval: NodeJS.Timeout | undefined = undefined;

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { data } = event;

  switch (data.__type) {
    case "init":
      await handleInit(data);
      break;
    default:
      console.error("Unrecognized message sent to worker", event);
      break;
  }
};

/**
 * Initializes the services and stores them in the global context.
 */
const handleInit = async (event: InitWorkerMessage) => {
  try {
    const { services, data } = await initialize("worker", event.appConfig);
    serviceContext = services;
    dataContext = data;
    serviceContext.logger.log("Albums worker initialized successfully");

    serviceContext.logger.log("Waiting for auth before first hydration...");

    // When the user gets authenticated, start a initial hydration and the
    // refresh interval. When we log them out, clear it.
    serviceContext.db
      .observe(() => dataContext?.auth.authenticatedUser())
      .subscribe({
        next: (user) => {
          if (user) {
            tryHydrate();
            startHydrationInterval();
          } else {
            clearInterval(hydrationInterval);
          }
        },
      });
  } catch {
    console.error("Failed to initialize services");
  }
};

const TIMEOUT_MS = 1000 * 60 * 1; // 1 minute.
const HYDRATION_INTERVAL_MS = 1000 * 60 * 5; // 5 minutes.

const startHydrationInterval = () => {
  hydrationInterval = setInterval(tryHydrate, HYDRATION_INTERVAL_MS);
};

let hydrationId = 0;

/**
 * Runs the hydration process in the background. If the hydration process
 * takes longer than one minute, it will be cancelled.
 */
const tryHydrate = async () => {
  if (serviceContext) {
    hydrationId += 1;
    serviceContext.albumsService
      .hydrateDatabase()
      .pipe(
        timeout({
          each: TIMEOUT_MS,
          with: () => throwError(() => new Error("Hydration was too slow")),
        }),
        finalize(() => console.log(`Hydration with ID ${hydrationId} finished`))
      )
      .subscribe();
  } else {
    console.error(
      `Attempted to hydrate albums before services were initialized`
    );
  }
};
