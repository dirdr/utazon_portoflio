import { useEffect, RefObject } from "react";
import { useActiveVideoCard } from "./useActiveVideoCard";

interface UseCardActivationOptions {
  cardId: string;
  /** Only for pointers that cannot hover. Hover devices elect on mouse enter. */
  enabled: boolean;
  elementRef: RefObject<HTMLElement | null>;
}

/**
 * Elects the card crossing the middle of the viewport as the active one.
 *
 * The band is a thin strip at the centre of the screen, so at most one card
 * claims at a time and the browser decodes a single video. Nothing is released
 * on exit: the next card's claim replaces the current one, which avoids a gap
 * where the list shows no motion at all.
 */
export const useCardActivation = ({
  cardId,
  enabled,
  elementRef,
}: UseCardActivationOptions) => {
  const { setActiveCard } = useActiveVideoCard();

  useEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveCard(cardId);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [cardId, enabled, elementRef, setActiveCard]);
};
