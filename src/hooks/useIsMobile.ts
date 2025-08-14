import { useState, useEffect, useCallback } from "react";

const MOBILE_BREAKPOINT = 1024; // md breakpoint - anything below is considered mobile
const TABLET_BREAKPOINT = 1280; // lg breakpoint - between md and lg is tablet

interface UseIsMobileOptions {
  breakpoint?: number;
  includeTouchDetection?: boolean;
  treatTabletsAsMobile?: boolean;
}

interface MobileDetectionResult {
  isMobile: boolean;
  isTouch: boolean;
  isTablet: boolean;
  viewportWidth: number;
  isPortrait: boolean;
}
export const useIsMobile = (
  options: UseIsMobileOptions = {},
): MobileDetectionResult => {
  const {
    breakpoint = MOBILE_BREAKPOINT,
    includeTouchDetection = true,
    treatTabletsAsMobile = true,
  } = options;

  const getDetectionResult = useCallback((): MobileDetectionResult => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isPortrait = viewportHeight > viewportWidth;

    const isTouch =
      includeTouchDetection &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - for older browsers
        navigator.msMaxTouchPoints > 0);

    const isSmallScreen = viewportWidth < breakpoint;
    const isMediumScreen =
      viewportWidth >= breakpoint && viewportWidth < TABLET_BREAKPOINT;

    const isTablet = isTouch && isMediumScreen;

    let isMobile = isSmallScreen;

    if (treatTabletsAsMobile && isTablet) {
      isMobile = true;
    }

    return {
      isMobile,
      isTouch,
      isTablet,
      viewportWidth,
      isPortrait,
    };
  }, [breakpoint, includeTouchDetection, treatTabletsAsMobile]);

  const [detection, setDetection] = useState<MobileDetectionResult>(() => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTouch: false,
        isTablet: false,
        viewportWidth: 1024,
        isPortrait: false,
      };
    }

    return getDetectionResult();
  });

  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDetection(getDetectionResult());
      }, 100);
    };

    const handleOrientationChange = () => {
      setTimeout(() => {
        setDetection(getDetectionResult());
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    setDetection(getDetectionResult());

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [
    breakpoint,
    includeTouchDetection,
    treatTabletsAsMobile,
    getDetectionResult,
  ]);

  return detection;
};

export const useIsMobileSimple = (
  options: UseIsMobileOptions = {},
): boolean => {
  const { isMobile } = useIsMobile(options);
  return isMobile;
};
