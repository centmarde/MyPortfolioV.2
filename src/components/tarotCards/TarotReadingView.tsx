import React, { useState, useEffect } from "react";
import { useTarotSelectionStore } from "../../stores/tarotSelectionData";
import { useIsMobile } from "../../hooks/use-mobile";
import { TarotReading } from "./components/TarotReading";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import type { TarotCard } from "@/components/composables/tarotConstant";

interface TarotReadingViewProps {
  onNavigate?: (path: string) => void;
}

// Default brand/theme color (matches the app's LoadingOverlay default)
const DEFAULT_THEME_COLOR = "#F2A6A6";

const TarotReadingView: React.FC<TarotReadingViewProps> = ({ onNavigate }) => {
  const {
    getSelectedCards,
    hasValidSelection,
    markReadingGenerated,
    getReadingContext,
  } = useTarotSelectionStore();
  const isMobile = useIsMobile();

  const themeColor = DEFAULT_THEME_COLOR;

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);

  useEffect(() => {
    // Reading context is already set in store when "Create Reading" was clicked
    const isGfReading = getReadingContext();
    console.log(
      `🔮 TarotReadingView initialized for: ${isGfReading ? "girlfriend" : "user"}`,
    );

    // Get selected cards from the store
    const storeCards = getSelectedCards();
    if (hasValidSelection()) {
      setSelectedCards(storeCards);
      markReadingGenerated(); // Mark that reading has been generated
    }

    setIsLoading(false);
  }, [getReadingContext, getSelectedCards, hasValidSelection, markReadingGenerated]);

  if (isLoading) {
    return (
      <LoadingOverlay
        isOpen={true}
        themeColor={themeColor}
        title="Preparing your mystical reading…"
        description="Just a moment"
      />
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isMobile ? "px-2 py-2" : "px-16 py-4"}`}
      style={{
        background: `linear-gradient(135deg, ${themeColor}08, ${themeColor}15, #ffffff)`,
      }}
    >
      <div className={`w-full ${isMobile ? "space-y-2" : "space-y-4"}`}>
        <TarotReading
          selectedCards={selectedCards}
          themeColor={themeColor}
          showReading={selectedCards.length === 6}
        />

        {selectedCards.length !== 6 && (
          <div className="text-center py-4">
            <p className="text-gray-600 text-base">
              No reading available. Please select 6 cards from the tarot deck
              first.
            </p>
            <Button
              onClick={() =>
                onNavigate
                  ? onNavigate("/tarot-cards")
                  : (window.location.href = "/tarot-cards")
              }
              className="inline-block mt-3 px-6 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200"
              style={{
                backgroundColor: themeColor,
                color: "white",
              }}
            >
              Select Your Cards
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TarotReadingView;
