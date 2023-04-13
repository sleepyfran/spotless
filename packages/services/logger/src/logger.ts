/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
  /**
   * Logs a verbose message.
   */
  log(...message: any[]): void;

  /**
   * Logs a warning message.
   */
  warn(...message: any[]): void;

  /**
   * Logs an error message.
   */
  error(...message: any[]): void;
}

/**
 * Implementation of the logger interface that logs to the browser's console.
 */
export class ConsoleLogger implements Logger {
  constructor(private readonly name: string) {}

  public log(...message: any[]): void {
    console.log(...this.decorateWithDate(...message));
  }
  public warn(...message: any[]): void {
    console.warn(...this.decorateWithDate(...message));
  }
  public error(...message: any[]): void {
    console.error(...this.decorateWithDate(...message));
  }

  private decorateWithDate(...message: any[]): any[] {
    return [new Date().toISOString(), this.name, "-", ...message];
  }
}
