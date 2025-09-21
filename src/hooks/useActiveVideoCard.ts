import { create } from 'zustand';

interface ActiveVideoCardState {
  activeCardId: string | null;
  setActiveCard: (cardId: string | null) => void;
}

export const useActiveVideoCard = create<ActiveVideoCardState>((set) => ({
  activeCardId: null,
  setActiveCard: (cardId) => set({ activeCardId: cardId }),
}));