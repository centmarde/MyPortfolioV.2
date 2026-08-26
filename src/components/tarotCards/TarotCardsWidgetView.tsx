import React, { useState } from "react";

import { Moon } from "lucide-react";
import TarotCardsWidget from "./components/TarotCardsWidget";
import { TarotHeader } from "./components/TarotHeader";
import ReadingContextDialog from "./dialogs/ReadingContextDialog";
import { useIsMobile } from "../../hooks/use-mobile";
import { useTarotSelectionStore } from "../../stores/tarotSelectionData";
import type { TarotCard } from "@/components/composables/tarotConstant";
import type { AnimationPhase } from "./types";
import { ChromaticImage } from "../ui/chromatic-image";
import "../../styles/tarot.css";

interface TarotCardsWidgetViewProps {
  onNavigate?: (path: string) => void;
}

const TarotCardsWidgetView: React.FC<TarotCardsWidgetViewProps> = ({
  onNavigate,
}) => {
  const isMobile = useIsMobile();
  const { setSelectedCardsForReading, setReadingContext } =
    useTarotSelectionStore();

  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const [animationPhase, setAnimationPhase] =
    useState<AnimationPhase>("loading");
  const [contextOpen, setContextOpen] = useState(false);

  // Handle selected cards changes (no automatic store saving)
  const handleSetSelectedCards = (cards: TarotCard[]) => {
    setSelectedCards(cards);
    // Store saving now happens only when "Reveal Reading" is clicked
  };

  // Reveal Reading: save the actual selected cards (passed up from the widget,
  // which may keep them in internal state on desktop), then ask for context.
  const handleRevealReading = (cards: TarotCard[]) => {
    setSelectedCardsForReading(cards);
    setContextOpen(true);
  };

  // All 4 context steps are answered: save the context, then go to the reading.
  // The deck row is persisted to Supabase by the tarotCardsData store when the
  // reading deck is created.
  const handleContextComplete = (answers: {
    email: string;
    careerReality: string;
    relationshipStatus: string;
    specialHappenings: string;
  }) => {
    setReadingContext(
      answers.email,
      answers.careerReality,
      answers.relationshipStatus,
      answers.specialHappenings,
    );

    setContextOpen(false);
    onNavigate?.("/tarot-cards/continue");
  };

  return (
    <main className="tarot-shell min-h-screen overflow-hidden bg-background text-foreground">
      <div className="tarot-backdrop" aria-hidden="true">
        <ChromaticImage
          src="/tarot-night.png"
          alt=""
          className="size-full"
          backgroundColor="#0d0b12"
          scope="window"
          zoom={0.14}
          displacement={0.05}
          chromaticShift={0.012}
          tilt={0.1}
        />
      </div>
      <div className="tarot-vignette" aria-hidden="true" />

      {/* Header exported from the tarot reading portal */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a
          href="#top"
          className="flex items-center gap-3 text-foreground transition-opacity hover:opacity-80"
          aria-label="Arcana home"
        >
          <span className="grid size-9 place-items-center rounded-full border border-[#cd9943]/50 bg-background/30 backdrop-blur-sm">
            <Moon className="size-4 text-[#cd9943]" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg tracking-[0.18em]">
            D Strongest
          </span>
        </a>
        <div className="hidden items-center gap-3 text-muted-foreground sm:flex">
          <span
            className="size-1 rounded-full bg-[#cd9943]"
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.24em]">
            Private reading room
          </span>
        </div>
      </header>

      {/* Container Fluid - Full width with responsive padding */}
      <div className="relative z-10 w-full px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Container - Responsive max width */}
        <div
          className={`mx-auto space-y-8 ${isMobile ? "max-w-none" : "max-w-6xl"}`}
        >
          {/* Header Section */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#cd9943]">
                Create your reading
              </span>
            </div>
            <h1
              className={`mt-3 font-serif font-bold tracking-tight text-foreground ${
                isMobile ? "text-3xl" : "text-4xl sm:text-5xl"
              }`}
            >
              Create Tarot Reading
            </h1>
            <div
              className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-[#cd9943]/70 to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Mobile: TarotHeader below main title */}
          {isMobile && (
            <TarotHeader
              animationPhase={animationPhase}
              selectedCards={selectedCards}
              isMobile={isMobile}
              onNavigate={onNavigate || (() => {})}
              onReveal={handleRevealReading}
            />
          )}

          {/* Tarot Cards Widget - Pass isMobile prop */}
          {isMobile ? (
            <div className="mx-auto w-full max-w-[420px] rounded-3xl border border-[#cd9943]/30 bg-card/50 p-4 shadow-2xl backdrop-blur-md">
              <TarotCardsWidget
                isMobile={isMobile}
                onNavigate={onNavigate}
                onReveal={handleRevealReading}
                selectedCards={selectedCards}
                setSelectedCards={handleSetSelectedCards}
                setAnimationPhase={setAnimationPhase}
              />
            </div>
          ) : (
            <TarotCardsWidget
              isMobile={isMobile}
              onNavigate={onNavigate}
              onReveal={handleRevealReading}
              selectedCards={selectedCards}
              setSelectedCards={handleSetSelectedCards}
              setAnimationPhase={setAnimationPhase}
            />
          )}
        </div>
      </div>

      {/* Intake dialog: email + life context fed to the AI before reading */}
      <ReadingContextDialog
        isOpen={contextOpen}
        onOpenChange={setContextOpen}
        onComplete={handleContextComplete}
      />
    </main>
  );
};

export default TarotCardsWidgetView;
