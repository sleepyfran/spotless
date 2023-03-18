import { IStorage } from "./storage.interface";

/**
 * An implementation for the storage interface that uses the local storage of
 * the browser as the underlying mechanism for storing things. Uses JSON.stringify
 * and JSON.parse to store items as strings and later parse them into the given
 * type.
 */
export class LocalStorage implements IStorage {
  retrieve<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);

    if (!item) {
      return undefined;
    }

    return JSON.parse(item) as T;
  }

  save<T>(key: string, item: T): void {
    window.localStorage.setItem(key, JSON.stringify(item));
  }
}
