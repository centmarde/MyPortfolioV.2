import React, { useState, useEffect } from "react";
import { useTarotSelectionStore } from "../../stores/tarotSelectionData";
import { TarotReading } from "./components/TarotReading";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import type { TarotCard } from "@/components/composables/tarotConstant";

interface TarotReadingViewProps {
  onNavigate?: (path: string) => void;
}

const TarotReadingView: React.FC<TarotReadingViewProps> = ({ onNavigate }) => {
  const {
    getSelectedCards,
    hasValidSelection,
    markReadingGenerated,
    getUserEmail,
  } = useTarotSelectionStore();

  const [isLoading, setIsLoading] = useState(true);
  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);

  useEffect(() => {
    // The reader's email is available from the store
    const userEmail = getUserEmail();
    console.log(
      `🔮 TarotReadingView initialized for: ${userEmail || "guest"}`,
    );

    // Get selected cards from the store
    const storeCards = getSelectedCards();
    if (hasValidSelection()) {
      setSelectedCards(storeCards);
      markReadingGenerated(); // Mark that reading has been generated
    }

    setIsLoading(false);
  }, [getUserEmail, getSelectedCards, hasValidSelection, markReadingGenerated]);

  if (isLoading) {
    return (
      <LoadingOverlay
        isOpen={true}
        themeColor="#cd9943"
        title="Preparing your mystical reading…"
        description="Just a moment"
      />
    );
  }

  return (
    <div className="w-full">
      <div className="w-full">
        <TarotReading
          selectedCards={selectedCards}
          showReading={selectedCards.length === 6}
        />

        {selectedCards.length !== 6 && (
          <div className="relative z-10 px-4 pb-12 pt-6 text-center">
            <p className="text-muted-foreground text-base">
              No reading available. Please select 6 cards from the tarot deck
              first.
            </p>
            <Button
              onClick={() =>
                onNavigate
                  ? onNavigate("/tarot-cards")
                  : (window.location.href = "/tarot-cards")
              }
              className="inline-block mt-3 px-6 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200 text-[#1a1202]"
              style={{
                backgroundColor: "#d4af37",
                borderColor: "#d4af37",
                color: "#1a1202",
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
