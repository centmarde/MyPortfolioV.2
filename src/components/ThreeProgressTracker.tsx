import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useThreeLoader } from '../hooks/useThreeLoader';

export const ThreeProgressTracker = () => {
  const { progress, loaded, total, active } = useProgress();
  const { setProgress, setLoaded, setTotal, setActive } = useThreeLoader();

  useEffect(() => {
    setProgress(progress);
    setLoaded(loaded);
    setTotal(total);
    setActive(active);
  }, [progress, loaded, total, active, setProgress, setLoaded, setTotal, setActive]);

  return null; // This component doesn't render anything
};
