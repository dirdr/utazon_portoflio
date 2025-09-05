import { useEffect, useRef, useCallback, useMemo } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { scrollPositionStore } from "../stores/scrollPositionStore";

export interface LocomotiveScrollOptions {
  smooth?: boolean;
  multiplier?: number;
  class?: string;
  smoothMobile?: boolean;
  getDirection?: boolean;
  getSpeed?: boolean;
  lerp?: number;
  reloadOnContextChange?: boolean;
  touchMultiplier?: number;
  firefoxMultiplier?: number;
  tablet?: {
    smooth?: boolean;
  };
  smartphone?: {
    smooth?: boolean;
  };
}

export const useLocomotiveScroll = (
  options: LocomotiveScrollOptions = {},
  dependencies: unknown[] = [],
) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveScrollRef = useRef<LocomotiveScroll | null>(null);

  const defaultOptions: LocomotiveScrollOptions = useMemo(
    () => ({
      smooth: true,
      multiplier: 0.6,
      class: "is-revealed",
      smoothMobile: true,
      getDirection: true,
      getSpeed: true,
      lerp: 0.1,
      reloadOnContextChange: false,
      touchMultiplier: 1,
    }),
    [],
  );

  const mergedOptions = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [defaultOptions, options],
  );

  const initScroll = useCallback(() => {
    if (!scrollRef.current) return;


    // Find the data-scroll-container element
    const scrollContainer =
      scrollRef.current.querySelector("[data-scroll-container]") ||
      scrollRef.current;

    locomotiveScrollRef.current = new LocomotiveScroll({
      el: scrollContainer,
      ...mergedOptions,
    });

    // Update global scroll position store on scroll
    locomotiveScrollRef.current.on('scroll', (args) => {
      scrollPositionStore.setPosition(args.scroll.y);
    });
    
    // Store locomotive scroll instance globally
    scrollPositionStore.setLocomotiveScroll(locomotiveScrollRef.current);

    // If we're in a transition and have a preserved position, restore it
    if (scrollPositionStore.isTransitioning && scrollPositionStore.preservedPosition > 0) {
      // Restore the scroll position after a short delay to ensure locomotive is ready
      setTimeout(() => {
        if (locomotiveScrollRef.current) {
          locomotiveScrollRef.current.scrollTo(scrollPositionStore.preservedPosition, {
            disableLerp: true,
            duration: 0
          });
          scrollPositionStore.setPosition(scrollPositionStore.preservedPosition);
        }
      }, 50);
    }

    return locomotiveScrollRef.current;
  }, [mergedOptions]);

  const destroyScroll = useCallback(() => {
    if (locomotiveScrollRef.current) {
      locomotiveScrollRef.current.destroy();
      locomotiveScrollRef.current = null;
      scrollPositionStore.setLocomotiveScroll(null);
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
    initScroll();

    return () => {
      destroyScroll();
    };
  }, [scrollRef.current, JSON.stringify(mergedOptions), ...dependencies]);

  useEffect(() => {
    const handleResize = () => {
      updateScroll();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
