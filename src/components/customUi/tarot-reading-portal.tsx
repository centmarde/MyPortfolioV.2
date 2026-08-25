"use client";

import { useState } from "react";
import "../../styles/tarot.css";
import {
  ArrowRight,
  Briefcase,
  LoaderCircle,
  Moon,
  Plus,
  Sparkles,
} from "lucide-react";
import { ChromaticImage } from "../ui/chromatic-image";
import { tarotCards, type TarotCard } from "../composables/tarotConstant";
import { getImagePath } from "../tarotCards/utils";

export function TarotReadingPortal({
  onNavigate,
}: {
  onNavigate?: (path: string) => void;
}) {
  const [isCreating, setIsCreating] = useState(false);
  // Randomly "fetch" a card from the deck on mount so the featured reveal
  // card is different every time the reading room opens.
  const [cardIndex, setCardIndex] = useState(() =>
    Math.floor(Math.random() * tarotCards.length),
  );
  const randomCard: TarotCard = tarotCards[cardIndex];

  function drawCard() {
    if (tarotCards.length < 2) return;
    setCardIndex((current) => {
      let next = current;
      while (next === current) {
        next = Math.floor(Math.random() * tarotCards.length);
      }
      return next;
    });
  }

  function createReading() {
    setIsCreating(true);
    window.setTimeout(() => {
      setIsCreating(false);
      // Move to the card-selection ("Create Tarot Reading") step
      onNavigate?.("/tarot-cards-widget");
    }, 900);
  }

  return (
    <main className="tarot-shell min-h-screen overflow-hidden bg-background text-foreground">
      <div className="tarot-backdrop" aria-hidden="true">
        <ChromaticImage
          src="/tarot-night.png"
          alt=""
          className="size-full"
          backgroundColor="#0d0b12"
          scope="window"
          hotspots="#create-reading, #see-portfolio"
          hotspotRadius={170}
          zoom={0.14}
          displacement={0.05}
          chromaticShift={0.012}
          tilt={0.1}
        />
      </div>
      <div className="tarot-vignette" aria-hidden="true" />

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

      <section
        id="top"
        className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-7xl items-center px-6 pb-12 pt-4 lg:px-10"
      >
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="tarot-reveal flex flex-col items-start gap-6">
            <div className="flex items-center gap-3 text-primary">
              <Sparkles className="size-4 text-[#cd9943]" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#cd9943]">
                A new reading awaits
              </span>
            </div>
            <h1 className="max-w-2xl font-serif text-6xl leading-[0.9] tracking-[-0.03em] text-foreground sm:text-7xl lg:text-8xl">
              Come sit with <em className="text-[#cd9943]">the cards.</em>
            </h1>
            <p className="max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              A gentle, grounded reading for the question you&apos;re carrying.
              No predictions — just a mirror, a little ritual, and room to hear
              yourself clearly.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={createReading}
                disabled={isCreating}
                id="create-reading"
                className="tarot-button group inline-flex min-h-12 items-center gap-3 rounded-sm bg-[#d4af37] px-5 font-mono text-xs uppercase tracking-[0.12em] text-[#1a1202] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-80"
              >
                {isCreating ? (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Plus
                    className="size-4 transition-transform group-hover:rotate-90"
                    aria-hidden="true"
                  />
                )}
                {isCreating ? "Preparing deck" : "Create my reading"}
                {!isCreating && (
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => onNavigate?.("/home")}
                id="see-portfolio"
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-sm border border-border/70 bg-background/20 px-5 font-mono text-xs uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary/70 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Briefcase className="size-4" aria-hidden="true" />
                See my portfolio
              </button>
            </div>
          </div>

          <div
            className="tarot-reveal relative mx-auto w-full max-w-sm lg:justify-self-end"
            style={{ animationDelay: "180ms" }}
          >
            <div
              className="tarot-card relative aspect-[0.72] rotate-2 cursor-pointer rounded-[1.25rem] border border-primary/60 bg-card/60 p-3 shadow-2xl backdrop-blur-md transition-transform duration-700 hover:rotate-0"
              onClick={drawCard}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  drawCard();
                }
              }}
              aria-label={`Revealed card: ${randomCard.name}. Click to draw another card.`}
            >
              <div className="flex h-full flex-col items-center justify-between rounded-[0.9rem] border border-primary/30 px-5 py-8 text-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary">
                  Drawn for you
                </span>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-full h-90 max-w-[300px] aspect-square overflow-hidden rounded-lg border border-primary/50 bg-primary/5">
                    <div className="absolute inset-2 rounded-md border border-primary/25" />
                    <img
                      src={getImagePath(randomCard.image)}
                      alt={randomCard.name}
                      className="absolute inset-0 size-full rounded-md object-cover"
                    />
                  </div>
                  <div className="font-serif text-3xl italic text-foreground">
                    {randomCard.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 border-t border-border/50 px-6 py-8 text-muted-foreground sm:grid-cols-3 lg:px-10"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#cd9943]">01</span>
          <span className="text-sm">Click the create my reading button.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#cd9943]">02</span>
          <span className="text-sm">Draw six cards with intention.</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#cd9943]">03</span>
          <span className="text-sm">
            each cards will represent different aspects of your destiny.
          </span>
        </div>
      </section>
    </main>
  );
}
