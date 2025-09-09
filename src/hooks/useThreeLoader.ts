import { createContext, useContext } from 'react';

interface ThreeLoaderContextType {
  progress: number;
  loaded: number;
  total: number;
  active: boolean;
  setProgress: (progress: number) => void;
  setLoaded: (loaded: number) => void;
  setTotal: (total: number) => void;
  setActive: (active: boolean) => void;
}

export const ThreeLoaderContext = createContext<ThreeLoaderContextType>({
  progress: 0,
  loaded: 0,
  total: 0,
  active: false,
  setProgress: () => {},
  setLoaded: () => {},
  setTotal: () => {},
  setActive: () => {},
});

export const useThreeLoader = () => {
  const context = useContext(ThreeLoaderContext);
  if (!context) {
    throw new Error('useThreeLoader must be used within a ThreeLoaderProvider');
  }
  return context;
};
