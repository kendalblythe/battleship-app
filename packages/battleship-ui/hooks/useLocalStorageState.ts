import { useEffect, useEffectEvent, useState } from 'react';

export const useLocalStorageState = <T>(key: string, initialValue?: T) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onLoaded = useEffectEvent((storeValue: string | null) => {
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- Hydrate state from external storage after mount.
    setValue(storeValue ? JSON.parse(storeValue) : initialValue);
    // eslint-disable-next-line @eslint-react/set-state-in-effect -- Mark hydration complete after reading external storage.
    setIsLoaded(true);
  });

  // Restore persisted state after mount so rendering does not access localStorage.
  useEffect(() => onLoaded(localStorage.getItem(key)), [key]);

  const setValueAndUpdateLocalStorage = (value: T) => {
    setValue(value);
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [value, setValueAndUpdateLocalStorage, isLoaded] as const;
};

export default useLocalStorageState;
