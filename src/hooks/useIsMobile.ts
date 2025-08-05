import { useState, useEffect } from 'react';

/**
 * Mobile detection breakpoints (following Tailwind CSS conventions)
 * sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px
 */
const MOBILE_BREAKPOINT = 768; // md breakpoint - anything below is considered mobile
const TABLET_BREAKPOINT = 1024; // lg breakpoint - between md and lg is tablet

interface UseIsMobileOptions {
  /**
   * Custom breakpoint for mobile detection (default: 768px)
   */
  breakpoint?: number;
  /**
   * Whether to include touch capability detection (default: true)
   * Helps identify devices that have touch but large screens (like Surface Pro)
   */
  includeTouchDetection?: boolean;
  /**
   * Whether to treat tablets as mobile (default: true)
   * Set to false if you want tablet-specific behavior
   */
  treatTabletsAsMobile?: boolean;
}

interface MobileDetectionResult {
  /** True if device is considered mobile based on screen size and touch capability */
  isMobile: boolean;
  /** True if device has touch capability */
  isTouch: boolean;
  /** True if device is likely a tablet (large touch screen) */
  isTablet: boolean;
  /** Current viewport width */
  viewportWidth: number;
  /** True if device is in portrait orientation */
  isPortrait: boolean;
}

/**
 * Industry-standard mobile detection hook combining viewport width and touch capability
 * 
 * Strategy:
 * 1. Primary: Viewport width detection (most reliable)
 * 2. Secondary: Touch capability detection (helps with edge cases)
 * 3. Orientation awareness for better tablet handling
 * 
 * This approach is:
 * - More reliable than user agent parsing
 * - Performant (uses native browser APIs)
 * - Responsive to orientation changes
 * - Follows modern responsive design principles
 */
export const useIsMobile = (options: UseIsMobileOptions = {}): MobileDetectionResult => {
  const {
    breakpoint = MOBILE_BREAKPOINT,
    includeTouchDetection = true,
    treatTabletsAsMobile = true
  } = options;

  const [detection, setDetection] = useState<MobileDetectionResult>(() => {
    // SSR-safe initialization
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTouch: false,
        isTablet: false,
        viewportWidth: 1024, // Default to desktop
        isPortrait: false
      };
    }

    return getDetectionResult();
  });

  function getDetectionResult(): MobileDetectionResult {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isPortrait = viewportHeight > viewportWidth;
    
    // Touch capability detection
    const isTouch = includeTouchDetection && (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore - for older browsers
      navigator.msMaxTouchPoints > 0
    );

    // Screen size classifications
    const isSmallScreen = viewportWidth < breakpoint;
    const isMediumScreen = viewportWidth >= breakpoint && viewportWidth < TABLET_BREAKPOINT;
    
    // Tablet detection: touch device with larger screen
    const isTablet = isTouch && isMediumScreen;
    
    // Mobile detection logic:
    // 1. Small screens are always mobile
    // 2. Medium screens with touch are tablets (mobile if treatTabletsAsMobile is true)
    // 3. Large screens without touch are desktop
    // 4. Large screens with touch might be touch laptops (not mobile)
    let isMobile = isSmallScreen;
    
    if (treatTabletsAsMobile && isTablet) {
      isMobile = true;
    }

    return {
      isMobile,
      isTouch,
      isTablet,
      viewportWidth,
      isPortrait
    };
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      // Debounce resize events to avoid excessive re-renders
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDetection(getDetectionResult());
      }, 100);
    };

    const handleOrientationChange = () => {
      // Handle orientation changes with a slight delay to ensure accurate measurements
      setTimeout(() => {
        setDetection(getDetectionResult());
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Initial detection after component mount (important for SSR)
    setDetection(getDetectionResult());

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [breakpoint, includeTouchDetection, treatTabletsAsMobile]);

  return detection;
};

/**
 * Simplified hook that just returns boolean isMobile
 * Useful when you only need basic mobile detection
 */
export const useIsMobileSimple = (options: UseIsMobileOptions = {}): boolean => {
  const { isMobile } = useIsMobile(options);
  return isMobile;
};