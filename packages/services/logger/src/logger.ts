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
  public log(message: string): void {
    console.log(this.decorateWithDate(message));
  }
  public warn(message: string): void {
    console.warn(this.decorateWithDate(message));
  }
  public error(message: string): void {
    console.error(this.decorateWithDate(message));
  }

  private decorateWithDate(message: string): string {
    return `${new Date().toISOString()} - ${message}`;
  }
}
