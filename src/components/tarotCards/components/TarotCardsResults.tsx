import { TarotReadingPortal } from "@/components/customUi/tarot-reading-portal";

interface TarotCardsResultsProps {
  onNavigate?: (path: string) => void;
}

export function TarotCardsResults({
  onNavigate,
}: TarotCardsResultsProps) {
  return <TarotReadingPortal onNavigate={onNavigate} />;
}

export default TarotCardsResults;
