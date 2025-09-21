import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { getRouteAssets, shouldPreloadRoute } from "../config/routeAssets";
import { useLenis } from "./useLenis";
import { useCanvasReadiness } from "./useCanvasReadiness";
import { isMobile } from "../utils/mobileDetection";

const shouldWaitForCanvas = (route: string): boolean => {
  return route === "/about" && !isMobile();
};

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

// Router that intercepts navigation and handles smooth transitions
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
    if (urls.length === 0) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      let completedCount = 0;
      const totalCount = urls.length;

      const checkComplete = () => {
        completedCount++;
        const progress = (completedCount / totalCount) * 100;

        setState((prev) => ({
          ...prev,
          progress: 50 + progress * 0.3,
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

  const waitForCanvasReadiness = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      if (areAllCanvasesReady()) {
        setState((prev) => ({ ...prev, progress: 90 }));
        resolve();
        return;
      }

      setState((prev) => ({ ...prev, progress: 80 }));

      const unsubscribe = onCanvasReadyChange((allReady) => {
        if (allReady) {
          setState((prev) => ({ ...prev, progress: 90 }));
          unsubscribe();
          resolve();
        }
      });

      canvasReadyUnsubscribeRef.current = unsubscribe;

      // Fallback timeout - don't wait forever for canvas
      setTimeout(() => {
        setState((prev) => ({ ...prev, progress: 90 }));
        unsubscribe();
        resolve();
      }, 2000);
    });
  }, [areAllCanvasesReady, onCanvasReadyChange]);

  const handleFadeInComplete = useCallback(async () => {
    if (!state.pendingLocation) {
      return;
    }

    const blackScreenStartTime = Date.now();
    const minBlackScreenDuration = duration / 3;
    const newLocation = state.pendingLocation;

    const shouldPreload = shouldPreloadRoute(newLocation);
    const cacheUrls = shouldPreload ? getRouteAssets(newLocation) : [];

    setState((prev) => ({ ...prev, progress: 50 }));

    setLocation(newLocation);
    setState((prev) => ({
      ...prev,
      currentLocation: newLocation,
      progress: 60,
    }));

    scrollToTop();

    // Reset Canvas states for new route - ensures fresh Canvas registration
    resetAllCanvases();

    if (cacheUrls.length > 0) {
      await verifyCacheUrls(cacheUrls);
    }
    setState((prev) => ({ ...prev, progress: 80 }));

    if (shouldWaitForCanvas(newLocation)) {
      await waitForCanvasReadiness();
    }

    if (newLocation === "/") {
      await preloadHomeVideo();
    }

    // Ensure minimum black screen duration for smooth transitions
    const processingTime = Date.now() - blackScreenStartTime;
    const remainingTime = Math.max(0, minBlackScreenDuration - processingTime);

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    setState((prev) => ({ ...prev, progress: 100 }));

    setState((prev) => ({
      ...prev,
      isTransitioning: false,
      pendingLocation: null,
      fadeInComplete: false,
    }));
  }, [state.pendingLocation, setLocation, verifyCacheUrls, waitForCanvasReadiness, duration, scrollToTop, resetAllCanvases]);
  useEffect(() => {
    return () => {
      if (canvasReadyUnsubscribeRef.current) {
        canvasReadyUnsubscribeRef.current();
      }
    };
  }, []);

  const navigateWithTransition = useCallback(
    async (newLocation: string) => {
      if (newLocation === state.currentLocation) {
        return;
      }

      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        pendingLocation: newLocation,
        progress: 0,
        fadeInComplete: false,
      }));
    },
    [state.currentLocation],
  );

  const navigate = useCallback(
    (newLocation: string) => {
      setLocation(newLocation);
      setState((prev) => ({ ...prev, currentLocation: newLocation }));
    },
    [setLocation],
  );
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

