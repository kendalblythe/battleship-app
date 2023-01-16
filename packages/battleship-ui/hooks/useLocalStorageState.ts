import { useEffect, useState } from 'react';

export const useLocalStorageState = <T>(key: string, fallbackValue: T) => {
  const [value, setValue] = useState(fallbackValue);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    setValue(stored ? JSON.parse(stored) : fallbackValue);
  }, [key, fallbackValue]);

  const setValueAndUpdateLocalStorage = (value: T) => {
    setValue(value);
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [value, setValueAndUpdateLocalStorage] as const;
};

export default useLocalStorageState;
