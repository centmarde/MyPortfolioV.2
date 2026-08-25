import React, { useState } from "react";

import { Target } from "lucide-react";
import TarotCardsWidget from "./components/TarotCardsWidget";
import { TarotHeader } from "./components/TarotHeader";
import { useIsMobile } from "../../hooks/use-mobile";
import type { TarotCard } from "@/components/composables/tarotConstant";
import type { AnimationPhase } from "./types";

// Default brand/theme color (matches the app's LoadingOverlay default)
const DEFAULT_THEME_COLOR = "#F2A6A6";

interface TarotCardsWidgetViewProps {
  onNavigate?: (path: string) => void;
}

const TarotCardsWidgetView: React.FC<TarotCardsWidgetViewProps> = ({
  onNavigate,
}) => {
  const isMobile = useIsMobile();
  const themeColor = DEFAULT_THEME_COLOR;

  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [animationPhase, setAnimationPhase] =
    useState<AnimationPhase>("loading");

  // Handle selected cards changes (no automatic store saving)
  const handleSetSelectedCards = (cards: TarotCard[]) => {
    setSelectedCards(cards);
    // Store saving now happens only when "Reveal Reading" is clicked
  };

  return (
    <div className="min-h-screen">
      {/* Container Fluid - Full width with responsive padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Container - Responsive max width */}
        <div
          className={`mx-auto space-y-8 ${isMobile ? "max-w-none" : "max-w-6xl"}`}
        >
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
                  fontSize: isMobile
                    ? "clamp(1.5rem, 6vw, 2.5rem)"
                    : "clamp(2rem, 5vw, 3rem)",
                  color: "#333333",
                }}
              >
                Create Tarot Reading
              </h1>
              <Target
                size={isMobile ? 32 : 40}
                color={themeColor}
                className="animate-pulse"
              />
            </div>
          </div>

          {/* Mobile: TarotHeader below main title */}
          {isMobile && (
            <div className="px-4">
              <TarotHeader
                themeColor={themeColor}
                animationPhase={animationPhase}
                selectedCards={selectedCards}
                isMobile={isMobile}
                onNavigate={onNavigate || (() => {})}
              />
            </div>
          )}

          {/* Tarot Cards Widget - Pass isMobile prop */}
          {isMobile ? (
            <div
              className="bg-white rounded-lg shadow-lg p-4 mx-auto"
              style={{
                maxWidth: "420px",
                width: "100%",
                border: `2px solid ${themeColor}20`,
                position: "relative",
                zIndex: 1,
                marginTop: "85vh", // Large gap for mobile headers
              }}
            >
              <TarotCardsWidget
                themeColor={themeColor}
                isMobile={isMobile}
                selectedCards={selectedCards}
                setSelectedCards={handleSetSelectedCards}
                setAnimationPhase={setAnimationPhase}
              />
            </div>
          ) : (
            <TarotCardsWidget
              themeColor={themeColor}
              isMobile={isMobile}
              onNavigate={onNavigate}
              selectedCards={selectedCards}
              setSelectedCards={handleSetSelectedCards}
              setAnimationPhase={setAnimationPhase}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TarotCardsWidgetView;
