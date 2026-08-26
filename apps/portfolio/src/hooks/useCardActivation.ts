import { useEffect, RefObject } from "react";
import { useActiveVideoCard, getActiveCardId } from "./useActiveVideoCard";

/**
 * Activation band, as a slice of the viewport measured from the top.
 *
 * It sits in the upper third rather than dead centre: at the top of the list
 * the first card occupies roughly 15%-40% of the screen, so a centred band
 * would elect the *second* card and the first would never play. Keep the band
 * thin so only one card can occupy it at a time.
 */
const BAND_TOP = 25;
const BAND_BOTTOM = 70;
const ROOT_MARGIN = `-${BAND_TOP}% 0px -${BAND_BOTTOM}% 0px`;

interface UseCardActivationOptions {
  cardId: string;
  /** Only for pointers that cannot hover. Hover devices elect on mouse enter. */
  enabled: boolean;
  /** The top card claims on mount so something is playing before any scroll. */
  isFirst?: boolean;
  elementRef: RefObject<HTMLElement | null>;
}

/**
 * Elects the topmost card in view as the active one.
 *
 * Nothing is released on exit: the next card's claim replaces the current one,
 * which avoids a gap where the list shows no motion at all.
 */
export const useCardActivation = ({
  cardId,
  enabled,
  isFirst = false,
  elementRef,
}: UseCardActivationOptions) => {
  const { setActiveCard } = useActiveVideoCard();

  useEffect(() => {
    if (!enabled || !isFirst) return;
    // Only seed when the list is untouched, so a restored scroll position
    // keeps whichever card the observer elects.
    if (getActiveCardId() === null) setActiveCard(cardId);
  }, [enabled, isFirst, cardId, setActiveCard]);

  useEffect(() => {
    const element = elementRef.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveCard(cardId);
      },
      { rootMargin: ROOT_MARGIN, threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [cardId, enabled, elementRef, setActiveCard]);
};
