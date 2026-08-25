import React from "react";
import { TarotCardsResults } from "./components/TarotCardsResults";

interface TarotCardsViewProps {
  onNavigate?: (path: string) => void;
}

const TarotCardsView: React.FC<TarotCardsViewProps> = ({ onNavigate }) => {
  return (
    <TarotCardsResults
      onNavigate={onNavigate}
    />
  );
};

export default TarotCardsView;
