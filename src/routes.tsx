import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import TarotCardsView from "./components/tarotCards/TarotCardsView";
import TarotCardsWidgetView from "./components/tarotCards/TarotCardsWidgetView";
import TarotReadingView from "./components/tarotCards/TarotReadingView";
import PortfolioPage from "./components/PortfolioPage";

// -----------------------------------------------------------------------------
// Route handlers.
//
// The tarot cards flow uses these internal paths (see onNavigate calls
// throughout the tarot components):
//   /tarot-cards          -> main Tarot Cards overview / results
//   /tarot-cards-widget   -> "Create Tarot Reading" card selection
//   /tarot-cards/continue -> final AI reading display
//
// "/" (and "/tarot-cards") is the landing page shown right after loading,
// so the portfolio sections are NOT shown initially.
// -----------------------------------------------------------------------------

// Each tarot view needs an onNavigate that uses the router. We wire it up
// with useNavigate inside a small wrapper so the Routes tree stays clean.
function TarotCardsRoute() {
  const navigate = useNavigate();
  return <TarotCardsView onNavigate={(path) => navigate(path)} />;
}

function TarotCardsWidgetRoute() {
  const navigate = useNavigate();
  return <TarotCardsWidgetView onNavigate={(path) => navigate(path)} />;
}

function TarotReadingRoute() {
  const navigate = useNavigate();
  return <TarotReadingView onNavigate={(path) => navigate(path)} />;
}

interface AppRoutesProps {
  loading: boolean;
  onAssetsLoaded: () => void;
  visitorCount: number | null;
}

export function AppRoutes({
  loading,
  onAssetsLoaded,
  visitorCount,
}: AppRoutesProps) {
  return (
    <Routes>
      {/* Tarot Cards landing page (shown first, without portfolio sections) */}
      <Route path="/" element={<TarotCardsRoute />} />
      <Route path="/tarot-cards" element={<TarotCardsRoute />} />

      {/* Create Tarot Reading (card selection) */}
      <Route path="/tarot-cards-widget" element={<TarotCardsWidgetRoute />} />

      {/* Reading display */}
      <Route path="/tarot-cards/continue" element={<TarotReadingRoute />} />

      {/* Portfolio (the former App sections) */}
      <Route
        path="/home"
        element={
          <PortfolioPage
            loading={loading}
            onAssetsLoaded={onAssetsLoaded}
            visitorCount={visitorCount}
          />
        }
      />

      {/* Fallback: anything unknown goes to the tarot landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}