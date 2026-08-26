import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  tarotCards,
  type TarotCard,
} from "@/components/composables/tarotConstant";
import type { TarotCardsWidgetProps } from "../types";
import { useAnimationSequence } from "../hooks/useAnimationSequence";
import { useTarotSelectionStore } from "../../../stores/tarotSelectionData";
import { TarotHeader } from "./TarotHeader";
import { TarotCardComponent } from "./TarotCardComponent";
import { getMobileDeckLayout } from "../utils";

/**
 * Main tarot cards widget component
 * Orchestrates the tarot card selection experience with animations
 */

/**
 * Fisher-Yates shuffle algorithm for randomizing card order
 * Uses function declaration to avoid JSX parsing issues with generics
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const TarotCardsWidget: React.FC<TarotCardsWidgetProps> = ({
  isMobile,
  onNavigate,
  selectedCards: externalSelectedCards,
  setSelectedCards: externalSetSelectedCards,
  setAnimationPhase: externalSetAnimationPhase,
}) => {
  const [internalSelectedCards, setInternalSelectedCards] = useState<
    TarotCard[]
  >([]);
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);

  // Store the selection into the zustand store (and localStorage) so the
  // reading view at /tarot-cards/continue can retrieve it on any device.
  const { setSelectedCardsForReading } = useTarotSelectionStore();

  // Create shuffled cards array once on component mount
  const [shuffledCards] = useState<TarotCard[]>(() => shuffleArray(tarotCards));

  // Create a second shuffle for compression phase
  const [compressedCards] = useState<TarotCard[]>(() =>
    shuffleArray(tarotCards),
  );

  // Animation sequence hook (must be before currentCards calculation)
  const { isLoading, animationPhase, revealedCards, flippedCards } =
    useAnimationSequence();

  // Determine which card array to use based on animation phase
  const currentCards =
    animationPhase === "compressing" ||
    animationPhase === "flipping" ||
    animationPhase === "selecting"
      ? compressedCards
      : shuffledCards;

  // Mobile deck is a 7-column grid; size its container from the row count so
  // the cards never spill over the surrounding view.
  const mobileDeck = getMobileDeckLayout(currentCards.length, animationPhase);

  // Use external state for mobile, internal state for desktop
  const selectedCards =
    isMobile && externalSelectedCards !== undefined
      ? externalSelectedCards
      : internalSelectedCards;
  const setSelectedCards =
    isMobile && externalSetSelectedCards
      ? externalSetSelectedCards
      : setInternalSelectedCards;

  // Sync animation phase to external state for mobile
  useEffect(() => {
    if (isMobile && externalSetAnimationPhase) {
      externalSetAnimationPhase(animationPhase);
    }
  }, [animationPhase, isMobile, externalSetAnimationPhase]);

  const handleCardClick = (card: TarotCard) => {
    if (animationPhase !== "selecting") return;

    // Check if card is already selected - if so, do nothing (no deselect to avoid cheating)
    if (selectedCards.find((c) => c.name === card.name)) {
      return;
    }

    // Only allow selection if less than 6 cards selected
    if (selectedCards.length >= 6) {
      return;
    }

    setAnimatingCard(card.name);
    setTimeout(() => setAnimatingCard(null), 600);

    // Only add to selection (no deselect)
    setSelectedCards([...selectedCards, card]);
  };

  // Reveal reading functionality now handled by navigation to /tarot-cards/continue

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div
          className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#cd9943]"
        ></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header Section - Only show in desktop, mobile renders it separately */}
      {!isMobile && (
        <TarotHeader
          animationPhase={animationPhase}
          selectedCards={selectedCards}
          isMobile={isMobile}
          onNavigate={onNavigate || (() => {})}
        />
      )}

      {/* Deck of Cards Layout */}
      <div
        className="flex justify-center items-center"
        style={{ minHeight: isMobile ? `${mobileDeck.height}px` : "400px" }}
      >
        <div
          className="relative"
          style={{
            width: isMobile ? "100%" : "min(1200px, 85vw)",
            height: isMobile ? `${mobileDeck.height}px` : "300px",
            maxWidth: isMobile ? "400px" : "1200px",
          }}
        >
          {currentCards.map((card, index) => {
            const isRevealed = revealedCards.includes(card.name);
            const isFlipped = flippedCards.includes(card.name);
            const isSelected = !!selectedCards.find(
              (c) => c.name === card.name,
            );
            const isAnimating = animatingCard === card.name;

            return (
              <TarotCardComponent
                key={`${card.name}-${animationPhase}`} // Include phase in key to trigger re-render on reshuffle
                card={card}
                index={index}
                isRevealed={isRevealed}
                isFlipped={isFlipped}
                isSelected={isSelected}
                isAnimating={isAnimating}
                animationPhase={animationPhase}
                selectedCards={selectedCards}
                onClick={() => handleCardClick(card)}
                isMobile={isMobile}
                totalCards={currentCards.length}
              />
            );
          })}
        </div>
      </div>

      {/* Reveal reading - large screens only, styled like the title font */}
      {!isMobile &&
        animationPhase === "selecting" &&
        selectedCards.length === 6 && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                // Persist the selection to the zustand store (and localStorage)
                // before navigating, so the reading view can retrieve it.
                setSelectedCardsForReading(selectedCards);
                onNavigate?.("/tarot-cards/continue");
              }}
              className="group inline-flex cursor-pointer items-center gap-3 font-serif text-2xl italic text-[#cd9943] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Sparkles
                size={22}
                className="animate-pulse"
                aria-hidden="true"
              />
              <span className="underline-offset-8 group-hover:underline">
                Reveal Reading
              </span>
              <ArrowRight
                size={22}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </button>
          </div>
        )}

      {/* Tarot Reading now handled in separate route */}
    </div>
  );
};

export default TarotCardsWidget;
