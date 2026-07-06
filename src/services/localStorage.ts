/**
 * A safe, type-safe wrapper for browser LocalStorage operations.
 * Handles serialization, parsing, and potential error cases.
 */
export const localStorageService = {
  /**
   * Retrieves an item from local storage, parsing it as JSON.
   * Returns defaultValue if the item is not found or parsing fails.
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Serializes and stores a value in local storage.
   */
  setItem<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Removes an item from local storage.
   */
  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Clears all items from local storage.
   */
  clear(): void {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
