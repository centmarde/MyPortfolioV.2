import { StrictMode, useState} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Loading from './components/Loader.tsx'
import { ThemeProvider } from './components/theme-provider'

// Create a wrapper component to handle the loading state
function AppWithLoader() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      {isLoading && <Loading onLoadingComplete={handleLoadingComplete} />}
      {/* Render App regardless, it will be hidden behind the loader until loading completes */}
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithLoader />
  </StrictMode>,
);
