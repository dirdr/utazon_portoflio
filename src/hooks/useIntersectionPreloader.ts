import { useCallback, useEffect, useRef, useState } from 'react';

interface IntersectionPreloaderConfig {
  rootMargin?: string;
  threshold?: number | number[];
  onIntersect?: (entry: IntersectionObserverEntry) => void;
}

interface IntersectionPreloaderResult {
  observeElement: (element: HTMLElement | null) => void;
  unobserveElement: (element: HTMLElement | null) => void;
  isIntersecting: boolean;
}

export const useIntersectionPreloader = (
  config: IntersectionPreloaderConfig = {}
): IntersectionPreloaderResult => {
  const {
    rootMargin = '100px',
    threshold = 0.1,
    onIntersect,
  } = config;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const isIntersectingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const wasIntersecting = isIntersectingRef.current;
      const isNowIntersecting = entry.isIntersecting;

      isIntersectingRef.current = isNowIntersecting;

      // Only trigger state update if intersection status actually changed
      if (wasIntersecting !== isNowIntersecting) {
        setIsIntersecting(isNowIntersecting);
      }

      if (isNowIntersecting && onIntersect) {
        onIntersect(entry);
      }
    });
  }, [onIntersect]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin,
      threshold,
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin, threshold]);

  const observeElement = useCallback((element: HTMLElement | null) => {
    if (!element || !observerRef.current) return;

    if (elementRef.current) {
      observerRef.current.unobserve(elementRef.current);
    }

    elementRef.current = element;
    observerRef.current.observe(element);
  }, []);

  const unobserveElement = useCallback((element: HTMLElement | null) => {
    if (!element || !observerRef.current) return;
    observerRef.current.unobserve(element);
    if (elementRef.current === element) {
      elementRef.current = null;
    }
  }, []);

  return {
    observeElement,
    unobserveElement,
    isIntersecting,
  };
};