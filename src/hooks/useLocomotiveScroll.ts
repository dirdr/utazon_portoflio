import { useEffect, useRef, useCallback } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

export interface LocomotiveScrollOptions {
  smooth?: boolean;
  multiplier?: number;
  class?: string;
  smoothMobile?: boolean;
  getDirection?: boolean;
  getSpeed?: boolean;
}

export const useLocomotiveScroll = (
  options: LocomotiveScrollOptions = {},
  dependencies: unknown[] = []
) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  const defaultOptions: LocomotiveScrollOptions = {
    smooth: true,
    multiplier: 1,
    class: 'is-revealed',
    smoothMobile: false,
    getDirection: true,
    getSpeed: true,
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const initScroll = useCallback(() => {
    if (!scrollRef.current) return;

    // Find the data-scroll-container element
    const scrollContainer = scrollRef.current.querySelector('[data-scroll-container]') || scrollRef.current;

    locomotiveScrollRef.current = new LocomotiveScroll({
      el: scrollContainer,
      ...mergedOptions,
    });

    return locomotiveScrollRef.current;
  }, [mergedOptions]);

  const destroyScroll = useCallback(() => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.destroy();
      locomotiveScrollRef.current = null;
    }
  }, []);

  const updateScroll = useCallback(() => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.update();
    }
  }, []);

  const scrollTo = useCallback((target: string | number, options?: object) => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.scrollTo(target, options);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    scrollTo(0);
  }, [scrollTo]);

  useEffect(() => {
    const scroll = initScroll();

    return () => {
      destroyScroll();
    };
  }, dependencies);

  useEffect(() => {
    const handleResize = () => {
      updateScroll();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScroll]);

  return {
    scrollRef,
    scroll: locomotiveScrollRef.current,
    updateScroll,
    scrollTo,
    scrollToTop,
    destroyScroll,
  };
};