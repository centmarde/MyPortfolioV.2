import type { TarotCard } from "@/components/composables/tarotConstant";

// Animation phase type
export type AnimationPhase =
  | "loading"
  | "revealing"
  | "compressing"
  | "flipping"
  | "selecting";

// Main widget props
export interface TarotCardsWidgetProps {
  isMobile: boolean;
  onNavigate?: (path: string) => void;
  onReveal?: (cards: TarotCard[]) => void;
  // Optional props for mobile view when TarotHeader is rendered externally
  selectedCards?: TarotCard[];
  setSelectedCards?: (cards: TarotCard[]) => void;
  setAnimationPhase?: (phase: AnimationPhase) => void;
}

// Component props interfaces
export interface TarotHeaderProps {
  animationPhase: AnimationPhase;
  selectedCards: TarotCard[];
  isMobile: boolean;
  onNavigate: (path: string) => void;
  onReveal?: (cards: TarotCard[]) => void;
}

export interface TarotCardProps {
  card: TarotCard;
  index: number;
  isRevealed: boolean;
  isFlipped: boolean;
  isSelected: boolean;
  isAnimating: boolean;
  animationPhase: AnimationPhase;
  selectedCards: TarotCard[];
  onClick: () => void;
  isMobile: boolean;
  totalCards: number;
}

export interface TarotReadingProps {
  selectedCards: TarotCard[];
  showReading: boolean;
}
