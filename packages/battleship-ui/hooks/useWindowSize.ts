import { useEffect, useState } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

export const useWindowSize = (): WindowSize => {
  const getWindowSize = (): WindowSize => {
    return typeof window === 'undefined' // window available client-side only
      ? { width: 0, height: 0 }
      : { width: window.innerWidth, height: window.innerWidth };
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handleResize = () => setWindowSize(getWindowSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
