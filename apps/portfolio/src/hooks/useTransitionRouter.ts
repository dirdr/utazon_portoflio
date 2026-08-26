import { useState, useCallback, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import {
  getRouteBlockingAssets,
  getRouteDeferredAssets,
  warmImages,
  shouldPreloadRoute,
  getRouteVideoKeys,
} from "../config/routeAssets";
import { useCanvasReadiness } from "./useCanvasReadiness";
import { isMobile } from "../utils/mobileDetection";
import { useBackgroundImageStore } from "./useBackgroundImageStore";
import { getBackgroundForRoute } from "../config/routeBackgroundConfig";
import { useAssetPrefetch } from "../contexts/AssetPrefetchContext";
import { ROUTES } from "../constants/routes";

const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");

const shouldWaitForCanvas = (route: string): boolean => {
  return route === ROUTES.ABOUT && !isMobile();
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

export const useTransitionRouter = (config: TransitionConfig = {}) => {
  const { duration = 600 } = config;
  const [location, setLocation] = useLocation();
  const { areAllCanvasesReady, onCanvasReadyChange, resetAllCanvases } =
    useCanvasReadiness();
  const { setBackgroundImage } = useBackgroundImageStore();
  const { prefetchVideos } = useAssetPrefetch();
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
    const cacheUrls = shouldPreload ? getRouteBlockingAssets(newLocation) : [];
    // Everything below the fold warms alongside the transition rather than
    // gating it; the placeholders cover the gap if a fetch is still in flight.
    if (shouldPreload) warmImages(getRouteDeferredAssets(newLocation));

    setState((prev) => ({ ...prev, progress: 30 }));

    const newBackground = getBackgroundForRoute(newLocation);
    if (newBackground) {
      setBackgroundImage(newBackground);
    } else {
      setBackgroundImage(null);
    }

    setState((prev) => ({ ...prev, progress: 50 }));

    setLocation(newLocation);
    setState((prev) => ({
      ...prev,
      currentLocation: newLocation,
      progress: 60,
    }));

    resetAllCanvases();

    // Prefetch presigned URLs for videos (fire-and-forget, don't block transition)
    const videoKeys = getRouteVideoKeys(newLocation);
    if (videoKeys.length > 0) {
      prefetchVideos(videoKeys, "high").catch((error) => {
        console.error("Failed to prefetch route videos:", error);
      });
    }

    if (cacheUrls.length > 0) {
      await verifyCacheUrls(cacheUrls);
    }
    setState((prev) => ({ ...prev, progress: 80 }));

    if (shouldWaitForCanvas(newLocation)) {
      await waitForCanvasReadiness();
    }

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
  }, [
    state.pendingLocation,
    setLocation,
    verifyCacheUrls,
    waitForCanvasReadiness,
    duration,
    resetAllCanvases,
    setBackgroundImage,
    prefetchVideos,
  ]);
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
