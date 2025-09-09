import { useState, ReactNode } from 'react';
import { ThreeLoaderContext } from '../hooks/useThreeLoader';

interface ThreeLoaderProviderProps {
  children: ReactNode;
}

export const ThreeLoaderProvider = ({ children }: ThreeLoaderProviderProps) => {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(false);

  return (
    <ThreeLoaderContext.Provider value={{
      progress,
      loaded,
      total,
      active,
      setProgress,
      setLoaded,
      setTotal,
      setActive,
    }}>
      {children}
    </ThreeLoaderContext.Provider>
  );
};
