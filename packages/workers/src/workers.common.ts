import {
  WorkerServices,
  Data,
  initializeWorkerServices,
} from "@spotless/services-bootstrap";
import { AppConfig } from "@spotless/types";
import { Single } from "@spotless/services-rx";
import { throwError, timeout } from "rxjs";

type HydrationFn<T> = (data: Data, services: WorkerServices) => Single<T>;

let serviceContext: WorkerServices | null = null;
let dataContext: Data | null = null;
let hydrationInterval: NodeJS.Timeout | undefined = undefined;

/**
 * Initializes the services and stores them in the global context.
 */
export const initHydration = async <T>(
  appConfig: AppConfig,
  interval: number,
  hydrate: HydrationFn<T>
) => {
  const logger = serviceContext?.createLogger("CommonWorker");

  try {
    const { services, data } = await initializeWorkerServices(appConfig);
    serviceContext = services;
    dataContext = data;

    logger?.log("Waiting for auth before first hydration...");

    // When the user gets authenticated, start a initial hydration and the
    // refresh interval. When we log them out, clear it.
    dataContext?.auth.authenticatedUser().subscribe({
      next: (user) => {
        if (user) {
          tryHydrate(hydrate);
          startHydrationInterval(interval, hydrate);
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

const startHydrationInterval = <T>(
  interval: number,
  hydrate: HydrationFn<T>
) => {
  hydrationInterval = setInterval(() => tryHydrate(hydrate), interval);
};

/**
 * Runs the hydration process in the background. If the hydration process
 * takes longer than one minute, it will be cancelled.
 */
const tryHydrate = <T>(hydrate: HydrationFn<T>) => {
  if (dataContext && serviceContext) {
    hydrate(dataContext, serviceContext)
      .pipe(
        timeout({
          each: TIMEOUT_MS,
          with: () => throwError(() => new Error("Hydration was too slow")),
        })
      )
      .subscribe();
  } else {
    console.error(
      `Attempted to hydrate albums before services were initialized`
    );
  }
};
