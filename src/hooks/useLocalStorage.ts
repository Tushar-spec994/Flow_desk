import { useState, useEffect } from 'react';
import { localStorageService } from '../services/localStorage';

/**
 * A custom hook that syncs state with LocalStorage.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return localStorageService.getItem<T>(key, initialValue);
  });

  useEffect(() => {
    localStorageService.setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
