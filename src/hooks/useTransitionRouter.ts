import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getRouteAssets, shouldPreloadRoute } from "../config/routeAssets";
import { useLenis } from "./useLenis";
import { useCanvasReadiness } from "./useCanvasReadiness";

const preloadHomeVideo = (): Promise<void> => {
  return Promise.resolve();
};

interface TransitionConfig {
  duration?: number;
  cacheVerificationUrls?: string[];
}

interface TransitionState {
  isTransitioning: boolean;
  currentLocation: string;
  pendingLocation: string | null;
  progress: number;
  fadeInComplete: boolean;
}

/**
 * Router that intercepts navigation and handles smooth transitions
 * Implements proper SPA transition pattern: fade current → switch → fade new
 */
export const useTransitionRouter = (config: TransitionConfig = {}) => {
  const { duration = 600 } = config;
  const [location, setLocation] = useLocation();
  const { scrollToTop } = useLenis();
  const { areAllCanvasesReady, onCanvasReadyChange, resetAllCanvases } = useCanvasReadiness();
  const canvasReadyUnsubscribeRef = useRef<(() => void) | null>(null);

  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    currentLocation: location,
    pendingLocation: null,
    progress: 0,
    fadeInComplete: false,
  });

  const verifyCacheUrls = useCallback((urls: string[]): Promise<void> => {
    if (urls.length === 0) return Promise.resolve();

    return new Promise((resolve) => {
      let completedCount = 0;
      const totalCount = urls.length;

      const checkComplete = () => {
        completedCount++;
        const progress = (completedCount / totalCount) * 100;
        setState((prev) => ({
          ...prev,
          progress: 50 + progress * 0.3, // Reduced to make room for canvas check
        }));

        if (completedCount === totalCount) {
          resolve();
        }
      };

      // Safari/Firefox cache coordination
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent,
      );
      const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

      urls.forEach((url, index) => {
        const img = new Image();

        img.addEventListener("load", checkComplete);
        img.addEventListener("error", checkComplete);

        if (isSafari || isFirefox) {
          img.crossOrigin = "anonymous";
          setTimeout(() => {
            img.src = url;
          }, index * 15);
        } else {
          img.src = url;
        }
      });
    });
  }, []);

  // Wait for all Canvas components to be ready
  const waitForCanvasReadiness = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      console.log('⏳ Waiting for canvas readiness...');

      // Check if already ready
      if (areAllCanvasesReady()) {
        console.log('✅ Canvas already ready, proceeding');
        setState((prev) => ({ ...prev, progress: 90 }));
        resolve();
        return;
      }

      // Set up listener for canvas readiness
      console.log('👂 Setting up canvas readiness listener');
      setState((prev) => ({ ...prev, progress: 80 }));

      const unsubscribe = onCanvasReadyChange((allReady) => {
        console.log('📡 Canvas readiness changed:', allReady);
        if (allReady) {
          console.log('🎉 All canvases ready! Continuing transition');
          setState((prev) => ({ ...prev, progress: 90 }));
          unsubscribe();
          resolve();
        }
      });

      // Cleanup on unmount
      canvasReadyUnsubscribeRef.current = unsubscribe;

      // Fallback timeout - don't wait forever for canvas
      setTimeout(() => {
        console.log('⏰ Canvas readiness timeout, proceeding anyway');
        setState((prev) => ({ ...prev, progress: 90 }));
        unsubscribe();
        resolve();
      }, 2000); // 2 second max wait for canvas
    });
  }, [areAllCanvasesReady, onCanvasReadyChange]);

  // Callback for when fade-in completes
  const handleFadeInComplete = useCallback(async () => {
    if (!state.pendingLocation) {
      return;
    }

    const blackScreenStartTime = Date.now();
    const minBlackScreenDuration = duration / 3; // Minimum 200ms for 600ms total

    const newLocation = state.pendingLocation;
    const shouldPreload = shouldPreloadRoute(newLocation);
    const cacheUrls = shouldPreload ? getRouteAssets(newLocation) : [];

    setState((prev) => ({ ...prev, progress: 50 }));

    // Phase 3: Switch routes during black screen
    setLocation(newLocation);
    setState((prev) => ({
      ...prev,
      currentLocation: newLocation,
      progress: 60,
    }));

    scrollToTop();

    // Reset Canvas states for new route - ensures fresh Canvas registration
    console.log('🔄 Resetting Canvas states for route change to:', newLocation);
    resetAllCanvases();

    // Phase 4: Cache verification (only if needed)
    if (cacheUrls.length > 0) {
      await verifyCacheUrls(cacheUrls);
    }
    setState((prev) => ({ ...prev, progress: 80 }));

    // Phase 5: Wait for Canvas readiness (critical for 3D pages)
    await waitForCanvasReadiness();

    if (newLocation === "/") {
      await preloadHomeVideo();
    }

    // Phase 6: Ensure minimum black screen duration for smooth transitions
    const processingTime = Date.now() - blackScreenStartTime;
    const remainingTime = Math.max(0, minBlackScreenDuration - processingTime);

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    setState((prev) => ({ ...prev, progress: 100 }));

    // Phase 6: Complete transition - start fade out
    setState((prev) => ({
      ...prev,
      isTransitioning: false,
      pendingLocation: null,
      fadeInComplete: false,
    }));
  }, [state.pendingLocation, setLocation, verifyCacheUrls, waitForCanvasReadiness, duration, scrollToTop, resetAllCanvases]);

  // Cleanup canvas subscription on unmount
  useEffect(() => {
    return () => {
      if (canvasReadyUnsubscribeRef.current) {
        canvasReadyUnsubscribeRef.current();
      }
    };
  }, []);

  // Navigate with transition (automatically determines assets to preload)
  const navigateWithTransition = useCallback(
    async (newLocation: string) => {
      if (newLocation === state.currentLocation) {
        return;
      }

      // Phase 1: Start transition - fade in overlay
      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        pendingLocation: newLocation,
        progress: 0,
        fadeInComplete: false,
      }));

      // Phase 2: Fade-in completion is handled by handleFadeInComplete callback
    },
    [state.currentLocation],
  );

  // Simple navigate (no transition, for same-page or immediate changes)
  const navigate = useCallback(
    (newLocation: string) => {
      setLocation(newLocation);
      setState((prev) => ({ ...prev, currentLocation: newLocation }));
    },
    [setLocation],
  );

  // Sync with external location changes (back/forward buttons)
  useEffect(() => {
    if (location !== state.currentLocation && !state.isTransitioning) {
      setState((prev) => ({ ...prev, currentLocation: location }));
    }
  }, [location, state.currentLocation, state.isTransitioning]);

  return {
    ...state,
    navigateWithTransition,
    navigate,
    duration,
    onFadeInComplete: handleFadeInComplete,
  };
};

