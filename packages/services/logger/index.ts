import { Logger, ConsoleLogger } from "./src/logger";
export type { Logger, ConsoleLogger };

export type LoggerFactory = (name: string) => Logger;

/**
 * Factory function for creating a logger that logs to the browser's console.
 * @param name the name of the logger.
 */
export const createConsoleLogger = (name: string): Logger => {
  return new ConsoleLogger(name);
};
