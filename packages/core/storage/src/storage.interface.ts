/**
 * Defines a common interfaces for the multiples ways that the app could handle
 * storage.
 */
export interface IStorage {
  /**
   * Retrieves an item identified by the given key.
   * @param key key that identifies the item.
   */
  retrieve<T>(key: string): T | undefined;

  /**
   * Saves a new item under the given key. If the key already exists, overrides
   * the previous item with the new one.
   * @param key key that identifies the item.
   * @param item item to save.
   */
  save<T>(key: string, item: T): void;
}
