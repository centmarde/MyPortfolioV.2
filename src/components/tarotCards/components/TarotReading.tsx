import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, Printer, Home, Moon } from "lucide-react";
import { useIsMobile } from "../../../hooks/use-mobile";
import { useTarotSelectionStore } from "../../../stores/tarotSelectionData";
import { aiTarotReadingService } from "@/lib/AiTarotReading";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/customUi/button";
import { ChromaticImage } from "../../ui/chromatic-image";
import type { TarotReadingProps } from "../types";
import { getImagePath } from "../utils";
import "../../../styles/tarot.css";

// Prevent duplicate AI generation calls (React 18 StrictMode runs effects twice in dev)
const IN_FLIGHT_AI_GENERATIONS = new Set<string>();

/**
 * Displays the final tarot reading with automatic AI-generated interpretations
 * Automatically generates personalized AI readings for each card position
 */
export const TarotReading: React.FC<TarotReadingProps> = ({
  selectedCards,
  showReading,
}) => {
  // Gold accents matching the tarot reading portal
  const accentColor = "#cd9943";
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);

  // Store access
  const {
    getAiReadingSession,
    setAiReadingSession,
    hasAiReading,
    getUserEmail,
    getReadingContextInfo,
  } = useTarotSelectionStore();

  // Get AI reading session if exists
  const aiSession = getAiReadingSession();
  const hasGeneratedReading = hasAiReading();

  // Custom titles for each card position - memoized to prevent re-creation
  const cardTitles = useMemo(
    () => [
      "How you feel about yourself",
      "What you want most right now",
      "Your fears",
      "What is going for you",
      "What is going against you",
      "The likely outcome",
    ],
    [],
  );

  // Memoized key to track when we should generate a new reading.
  // Include the reader's email so readings for different users don't collide.
  const shouldGenerateKey = useMemo(() => {
    const contextKey = getUserEmail() || "guest";
    return `${selectedCards.map((c) => c.name).join(",")}-${showReading}-${contextKey}`;
  }, [selectedCards, showReading, getUserEmail]);

  // Stable function to generate AI reading
  const generateAiReadingAutomatic = useCallback(async () => {
    // Only generate if we have cards, reading is shown, and no AI reading exists yet
    if (
      selectedCards.length !== 6 ||
      !showReading ||
      hasGeneratedReading ||
      isGenerating ||
      hasAttemptedGeneration
    ) {
      return;
    }

    // Avoid duplicate calls (e.g. React StrictMode remount)
    if (IN_FLIGHT_AI_GENERATIONS.has(shouldGenerateKey)) {
      console.log(
        "🔮 AI generation already in-flight, skipping duplicate call",
      );
      return;
    }

    IN_FLIGHT_AI_GENERATIONS.add(shouldGenerateKey);
    setIsGenerating(true);
    setHasAttemptedGeneration(true);
    console.log("🔮 Auto-generating AI tarot reading...");

    try {
      // Gather the reader context (email + life happenings) so the AI bases its
      // reading on what the reader shared during the intake dialog.
      const contextInfo = getReadingContextInfo();

      const response = await aiTarotReadingService.generateTarotReading({
        selectedCards,
        cardTitles,
        readerEmail: contextInfo.email,
        careerReality: contextInfo.careerReality,
        relationshipStatus: contextInfo.relationshipStatus,
        specialHappenings: contextInfo.specialHappenings,
      });

      if (response.success && response.session) {
        // Get the current reader's email from the store
        const userEmail = getUserEmail();
        console.log(
          `🔮 Auto-generated AI reading for: ${userEmail || "guest"}`,
        );

        // Pass the reader's email to setAiReadingSession
        setAiReadingSession(response.session, userEmail);
        console.log("🔮 AI tarot reading auto-generated successfully!");
      } else {
        console.error("Failed to generate AI reading:", response.error);
      }
    } catch (error) {
      console.error("Error auto-generating AI reading:", error);
    } finally {
      setIsGenerating(false);
      IN_FLIGHT_AI_GENERATIONS.delete(shouldGenerateKey);
    }
  }, [
    selectedCards,
    cardTitles,
    showReading,
    hasGeneratedReading,
    isGenerating,
    hasAttemptedGeneration,
    setAiReadingSession,
    getUserEmail,
    getReadingContextInfo,
    shouldGenerateKey,
  ]);

  // Reset attempt flag when shouldGenerateKey changes (new card selection)
  useEffect(() => {
    setHasAttemptedGeneration(false);
  }, [shouldGenerateKey]);

  // Automatically generate AI reading when component shows
  useEffect(() => {
    generateAiReadingAutomatic();
  }, [generateAiReadingAutomatic]);

  if (!showReading || selectedCards.length !== 6) return null;

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

      {/* Fluid container - full width on large screens */}
      <div id="top" className="relative z-10 w-full px-4 py-8 sm:px-6 lg:px-10">
        <Card className="w-full animate-in fade-in duration-700 border-[#cd9943]/40 bg-card/60 backdrop-blur-md">
          <LoadingOverlay
            isOpen={isGenerating}
            themeColor={accentColor}
            title="Preparing your reading…"
            description="Please wait while we prepare your personalized readings. This usually takes a few seconds…"
          />

          <CardHeader>
            <CardTitle
              className={`text-center flex items-center justify-center font-serif font-bold text-[#cd9943] ${
                isMobile
                  ? "gap-2 text-xl flex-col sm:flex-row"
                  : "gap-3 text-3xl"
              }`}
            >
              <Sparkles size={isMobile ? 24 : 32} className="animate-pulse" />
              Your Personalized Reading
              <Sparkles size={isMobile ? 24 : 32} className="animate-pulse" />
            </CardTitle>

            {/* Auto-generation Loading State */}
            {isGenerating && (
              <div className="text-center mt-4">
                <div className="flex items-center justify-center gap-2">
                  <Loader2
                    size={16}
                    className="animate-spin"
                    style={{ color: accentColor }}
                  />
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Generating your personalized reading...
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className={isMobile ? "space-y-4" : "space-y-8"}>
              {selectedCards.map((card, index) => {
                // Get AI reading for this card if available
                const aiReading =
                  hasGeneratedReading && aiSession?.readings[index];
                const useAiReading = aiReading && aiReading.cardIndex === index;

                return (
                  <div
                    key={card.name}
                    className={`rounded-lg border border-[#cd9943]/20 animate-in slide-in-from-left duration-500 ${
                      isMobile ? "flex flex-col gap-3 p-3" : "flex gap-6 p-6"
                    }`}
                    style={{
                      backgroundColor: `${accentColor}10`,
                      animationDelay: `${index * 200}ms`,
                    }}
                  >
                    <div
                      className={isMobile ? "flex justify-center" : "flex-none"}
                    >
                      <img
                        src={getImagePath(card.image)}
                        alt={card.name}
                        className={`object-contain rounded shadow-lg bg-white ${
                          isMobile ? "w-57 h-90 py-5" : "w-57 h-90 py-5"
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/assets/images/tarotCard.png";
                        }}
                      />
                    </div>
                    <div className={isMobile ? "text-center" : "flex-1"}>
                      <h4
                        className={`font-mono uppercase tracking-[0.2em] text-[#cd9943] ${
                          isMobile ? "mb-2 text-xs" : "mb-3 text-xs sm:text-sm"
                        }`}
                      >
                        Card {index + 1}: {cardTitles[index]} »
                      </h4>
                      <h5
                        className={`font-serif italic text-foreground ${
                          isMobile ? "text-base mb-1" : "text-xl mb-2"
                        }`}
                      >
                        {card.name}
                      </h5>

                      {/* AI Reading or Loading */}
                      {useAiReading ? (
                        <div
                          className={`leading-relaxed text-muted-foreground ${isMobile ? "text-sm" : ""}`}
                        >
                          <p>{aiReading.aiInterpretation}</p>
                        </div>
                      ) : isGenerating ? (
                        <div
                          className={`italic leading-relaxed text-muted-foreground/70 ${
                            isMobile ? "text-sm" : ""
                          }`}
                        >
                          <p>Generating personalized interpretation...</p>
                        </div>
                      ) : (
                        <div
                          className={`leading-relaxed text-muted-foreground ${isMobile ? "text-sm" : ""}`}
                        >
                          <p>{card.description.split("\n\n")[0]}</p>
                          {card.description.split("\n\n")[1] && (
                            <p
                              className={`leading-relaxed text-muted-foreground/70 ${
                                isMobile ? "mt-2 text-sm" : "mt-3"
                              }`}
                            >
                              {card.description.split("\n\n")[1]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reading actions */}
            <div
              className={`mt-8 flex items-center justify-center gap-3 ${
                isMobile ? "flex-col w-full" : "flex-row"
              }`}
            >
              <Button
                type="button"
                size="lg"
                className={`gap-2 font-medium text-[#1a1202] ${
                  isMobile ? "w-full" : ""
                }`}
                style={{ backgroundColor: "#d4af37", borderColor: "#d4af37" }}
                onClick={() => {
                  // TODO: implement PDF export for the reading
                }}
              >
                <Printer size={16} />
                Print as PDF
              </Button>
              <Button
                type="button"
                size="lg"
                className={`gap-2 ${isMobile ? "w-full" : ""}`}
                onClick={() => navigate("/")}
              >
                <Home size={16} />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
