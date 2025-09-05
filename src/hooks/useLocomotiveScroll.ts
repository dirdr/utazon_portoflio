import { useEffect, useRef, useCallback, useMemo } from "react";
import LocomotiveScroll, { ScrollEventArgs } from "locomotive-scroll";
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
    if (!scrollRef.current) {
      return;
    }

    // Find the data-scroll-container element
    const scrollContainer =
      scrollRef.current.querySelector("[data-scroll-container]") ||
      scrollRef.current;

    locomotiveScrollRef.current = new LocomotiveScroll({
      el: scrollContainer,
      ...mergedOptions,
    });

    // Update global scroll position store on scroll
    locomotiveScrollRef.current.on('scroll', (args: ScrollEventArgs) => {
      scrollPositionStore.setPosition(args.scroll.y);
    });
    
    // Store locomotive scroll instance globally
    scrollPositionStore.setLocomotiveScroll(locomotiveScrollRef.current);

    // No scroll restoration - new pages start at top

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

  // Stable options string for dependency array
  const optionsString = useMemo(() => JSON.stringify(mergedOptions), [mergedOptions]);

  useEffect(() => {
    initScroll();

    return () => {
      destroyScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initScroll, destroyScroll, optionsString, ...dependencies]);

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
