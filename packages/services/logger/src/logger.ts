export interface ILogger {
  /**
   * Logs a verbose message.
   */
  log(message: string): void;

  /**
   * Logs a warning message.
   */
  warn(message: string): void;

  /**
   * Logs an error message.
   */
  error(message: string): void;
}

/**
 * Implementation of the logger interface that logs to the browser's console.
 */
export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
  warn(message: string): void {
    console.warn(message);
  }
  error(message: string): void {
    console.error(message);
  }
}
