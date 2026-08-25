import React from "react";
import { Target } from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { TarotCardsResults } from "./components/TarotCardsResults";

// Default brand/theme color (matches the app's LoadingOverlay default)
const DEFAULT_THEME_COLOR = "#F2A6A6";

interface TarotCardsViewProps {
  onNavigate?: (path: string) => void;
}

const TarotCardsView: React.FC<TarotCardsViewProps> = ({ onNavigate }) => {
  const isMobile = useIsMobile();

  const themeColor = DEFAULT_THEME_COLOR;

  return (
    <div className="min-h-screen">
      {/* Container Fluid - Full width with responsive padding */}
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16 py-8">
        {/* Main Container - Use more width on large screens */}
        <div className={`mx-auto space-y-8 ${isMobile ? 'max-w-none' : 'max-w-screen-2xl'}`}>
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Target 
                size={isMobile ? 32 : 40} 
                color={themeColor}
                className="animate-pulse"
              />
              <h1
                className="text-gray-800 font-bold"
                style={{
                  fontSize: isMobile ? "clamp(1.5rem, 6vw, 2.5rem)" : "clamp(2rem, 5vw, 3rem)",
                  color: "#333333",
                }}
              >
                Tarot Cards
              </h1>
              <Target 
                size={isMobile ? 32 : 40} 
                color={themeColor}
                className="animate-pulse"
              />
            </div>
          </div>

          {/* Tarot Cards Results */}
          <div className={`bg-white rounded-lg shadow-lg w-full ${
            isMobile ? 'p-4 mx-2' : 'p-8'
          }`} style={{
            border: `2px solid ${themeColor}20`
          }}>
            <TarotCardsResults 
              themeColor={themeColor}
              bfName="Handsome"
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarotCardsView;