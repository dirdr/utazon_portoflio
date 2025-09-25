import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ActiveVideoCardState {
  activeCardId: string | null;
  setActiveCard: (cardId: string | null) => void;
}

// Use subscribeWithSelector to prevent unnecessary re-renders
const useActiveVideoCardStore = create<ActiveVideoCardState>()(subscribeWithSelector((set) => ({
  activeCardId: null,
  setActiveCard: (cardId) => set({ activeCardId: cardId }),
})));

// Selective subscription - only re-render when THIS card's state changes
export const useActiveVideoCard = (cardId?: string) => {
  const activeCardId = useActiveVideoCardStore((state) => state.activeCardId);
  const setActiveCard = useActiveVideoCardStore((state) => state.setActiveCard);

  if (cardId) {
    // Only trigger re-render if THIS card's active state changed
    const isActiveCard = activeCardId === cardId;
    return { activeCardId, setActiveCard, isActiveCard };
  }

  // For components that need the full state
  return { activeCardId, setActiveCard };
};