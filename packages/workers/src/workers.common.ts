import { Services, Data, initialize } from "@spotless/services-bootstrap";
import { AppConfig } from "@spotless/types";
import { Observable, throwError, timeout } from "rxjs";

type HydrationFn<T> = (services: Services) => Observable<T>;

let serviceContext: Services | null = null;
let dataContext: Data | null = null;
let hydrationInterval: NodeJS.Timeout | undefined = undefined;

/**
 * Initializes the services and stores them in the global context.
 */
export const initHydration = async <T>(
  appConfig: AppConfig,
  hydrate: HydrationFn<T>
) => {
  try {
    const { services, data } = await initialize("worker", appConfig);
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
            tryHydrate(hydrate);
            startHydrationInterval(hydrate);
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

const startHydrationInterval = <T>(hydrate: HydrationFn<T>) => {
  hydrationInterval = setInterval(
    () => tryHydrate(hydrate),
    HYDRATION_INTERVAL_MS
  );
};

/**
 * Runs the hydration process in the background. If the hydration process
 * takes longer than one minute, it will be cancelled.
 */
const tryHydrate = <T>(hydrate: HydrationFn<T>) => {
  if (serviceContext) {
    hydrate(serviceContext)
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
