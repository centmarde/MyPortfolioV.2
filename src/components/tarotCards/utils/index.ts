// Helper functions for tarot card functionality

/**
 * Removes 'public/' prefix from image paths since assets are served from root
 */
export const getImagePath = (imagePath: string): string => {
  return imagePath.replace('public/', '/');
};

/**
 * Shared mobile deck layout metrics so the container height always matches
 * the grid produced by calculateCardPosition (prevents cards overlapping
 * the surrounding view).
 */
export const getMobileDeckLayout = (
  totalCards: number,
  animationPhase: string = 'selecting',
) => {
  const columns = 7;
  const totalRows = Math.ceil(totalCards / columns);
  const rowHeight = animationPhase === 'compressing' ? 52 : 88;
  return {
    columns,
    totalRows,
    // Extra padding so lifted/selected cards don't clip at the edges
    height: totalRows * rowHeight + 60,
  };
};

/**
 * Calculates position and rotation for card in deck spread layout
 * Supports compressed positioning for animation phases
 */
export const calculateCardPosition = (index: number, totalCards: number, isMobile: boolean = false, animationPhase: string = 'selecting') => {
  if (isMobile) {
    // Mobile layout: fixed 7-column grid, sized to fit the screen width
    const maxCardsPerRow = 7;
    const containerMaxWidth = 380; // Max usable width (400px - padding)
    // ~54px per column so seven 50px-wide cards fit without overlap
    let cardSpacing = containerMaxWidth / maxCardsPerRow;
    let rowHeight = 88;

    // Compress cards during compression animation phase - center them more tightly
    if (animationPhase === 'compressing') {
      cardSpacing = 200 / maxCardsPerRow;
      rowHeight = 52;
    }

    // Calculate actual cards per row and number of rows needed
    const cardsPerRow = Math.min(maxCardsPerRow, totalCards);
    const totalRows = Math.ceil(totalCards / cardsPerRow);
    
    // Current card position
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    
    // Cards in current row (last row might have fewer cards)
    const cardsInCurrentRow = row === totalRows - 1 
      ? totalCards - (totalRows - 1) * cardsPerRow 
      : cardsPerRow;
    
    // Center cards in each row
    const rowWidth = (cardsInCurrentRow - 1) * cardSpacing;
    const leftPosition = -rowWidth / 2 + col * cardSpacing;
    const baseTopPosition = (row - (totalRows - 1) / 2) * rowHeight; // Center vertically around 0
    
    // Add slight vertical offset during compression for stacking effect
    const compressionOffset = animationPhase === 'compressing' 
      ? (index % 4 - 1.5) * 6 // Slight vertical variation for mobile stacking effect
      : 0;
    
    const topPosition = baseTopPosition + compressionOffset;
    
    return { 
      leftPosition, 
      topPosition, 
      rotation: 0, // No rotation on mobile for better readability
      isMobileLayout: true
    };
  }
  
  // Desktop layout: horizontal spread with compression support
  let spreadWidth = Math.min(1200, window.innerWidth * 0.85); // Use 85% of screen width, max 1200px
  
  // Compress cards during compression animation phase - center them more tightly
  if (animationPhase === 'compressing') {
    spreadWidth = Math.min(200, window.innerWidth * 0.15); // Maximum compression for center stacking
  }
  
  const cardSpacing = spreadWidth / (totalCards - 1);
  const totalWidth = (totalCards - 1) * cardSpacing;
  const leftPosition = -totalWidth / 2 + index * cardSpacing; // Center cards around position 0
  
  // Add slight vertical offset during compression for stacking effect
  const compressionTopPosition = animationPhase === 'compressing' 
    ? (index % 5 - 2) * 8 // Slight vertical variation for stacking effect
    : 0;
  
  const rotation = 0; // No rotation for clean straight layout
  
  return { 
    leftPosition, 
    topPosition: compressionTopPosition, 
    rotation,
    isMobileLayout: false
  };
};