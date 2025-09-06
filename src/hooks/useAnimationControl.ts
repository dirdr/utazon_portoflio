import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

interface UseAnimationControlOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useAnimationControl = ({
  threshold = 0.3,
  rootMargin = "50px",
  triggerOnce = false,
}: UseAnimationControlOptions = {}) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce,
  });

  useEffect(() => {
    setShouldAnimate(inView);
  }, [inView]);

  return {
    ref,
    shouldAnimate,
    inView,
  };
};