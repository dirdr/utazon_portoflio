import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface UseAnimationControlOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
  staggerDelay?: number;
  index?: number;
}

export const useAnimationControl = ({
  threshold = 0.3,
  rootMargin = "50px",
  triggerOnce = false,
  delay = 0,
  staggerDelay = 0,
  index = 0,
}: UseAnimationControlOptions = {}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const totalDelay = delay + (staggerDelay * index);

  useEffect(() => {
    if (inView && !hasTriggered) {
      // Batch state updates to prevent multiple re-renders
      if (triggerOnce) {
        setShouldAnimate(true);
        setHasTriggered(true);
      } else {
        setShouldAnimate(true);
      }
    } else if (!inView && !triggerOnce && shouldAnimate) {
      // Only update if different from current state
      setShouldAnimate(false);
    }
  }, [inView, triggerOnce, hasTriggered, shouldAnimate]);

  return {
    ref,
    shouldAnimate,
    inView,
    animationDelay: totalDelay,
  };
};