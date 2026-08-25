import { useEffect, useRef, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { ThreeLoaderProvider } from './components/ThreeLoaderProvider';
import Loading from './components/Loader';
import { AppRoutes } from './routes';

const COUNTER_API_BASE = '/api/counterapi';

function App() {
  const [loading, setLoading] = useState(true);
  const [assetsProgress, setAssetsProgress] = useState(0);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  // Protection flags to prevent infinite loops
  const loadingCompletedRef = useRef(false);
  const assetsLoadedRef = useRef(false);
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const initializedRef = useRef(false);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current) {
        clearTimeout(completionTimeoutRef.current);
      }
    };
  }, []);

  // Fetch visitor count once on app startup
  useEffect(() => {
    const fetchVisitorCount = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        const initRes = await fetch(`${COUNTER_API_BASE}/d-strongest-algorithms-team-4777/first-counter-4777/up`, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_COUNTER_API_TOKEN}`,
          },
        });
        const initData = await initRes.json();
        const value = (initData?.data?.up_count ?? 0) + 342;
        setVisitorCount(value);
      } catch (error) {
        console.error('Failed to fetch visitor count:', error);
        setVisitorCount(342);
      }
    };

    fetchVisitorCount();
  }, []);

  // Handle the completion of loading
  const handleLoadingComplete = () => {
    if (loadingCompletedRef.current) {
      return;
    }

    loadingCompletedRef.current = true;
    setLoading(false);
    // Ensure scroll is enabled and position is at top
    document.body.style.overflow = '';
    document.body.style.height = '';
    window.scrollTo(0, 0);
  };

  // Handle when 3D assets are fully loaded
  const handleAssetsLoaded = () => {
    if (assetsLoadedRef.current) {
      return;
    }

    assetsLoadedRef.current = true;
    setAssetsProgress(100);

    // Clear any existing timeout
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
    }

    // Trigger loading complete after a short delay
    completionTimeoutRef.current = setTimeout(() => {
      handleLoadingComplete();
    }, 800); // Small delay to show 100% before hiding
  };

  return (
    <ThemeProvider>
      <ThreeLoaderProvider>
        <BrowserRouter>
          {loading && <Loading onLoadingComplete={handleLoadingComplete} externalProgress={assetsProgress > 0 ? assetsProgress : undefined} />}
          <AppRoutes
            loading={loading}
            onAssetsLoaded={handleAssetsLoaded}
            visitorCount={visitorCount}
          />
        </BrowserRouter>
      </ThreeLoaderProvider>
    </ThemeProvider>
  );
}

export default App;
