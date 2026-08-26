import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ActiveVideoCardState {
  activeCardId: string | null;
  setActiveCard: (cardId: string | null) => void;
}

const useActiveVideoCardStore = create<ActiveVideoCardState>()(
  subscribeWithSelector((set) => ({
    activeCardId: null,
    setActiveCard: (cardId) => set({ activeCardId: cardId }),
  })),
);

/** Reads the active card without subscribing, for one-shot checks in effects. */
export const getActiveCardId = () => useActiveVideoCardStore.getState().activeCardId;

export const useActiveVideoCard = (cardId?: string) => {
  const activeCardId = useActiveVideoCardStore((state) => state.activeCardId);
  const setActiveCard = useActiveVideoCardStore((state) => state.setActiveCard);

  if (cardId) {
    const isActiveCard = activeCardId === cardId;
    return { activeCardId, setActiveCard, isActiveCard };
  }

  return { activeCardId, setActiveCard };
};
