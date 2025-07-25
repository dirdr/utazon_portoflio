import { useState, useEffect } from "react";
import { usePreloadAssets } from "./usePreloadAssets";

const SESSION_KEY = "spa-navigation-active";
const MIN_LOADING_TIME = 1000;

/**
 * Custom hook to manage app initialization state
 * Shows loader only on page refresh/first visit, not on SPA navigation
 * Uses session flag pattern to distinguish between page loads and route changes
 */
export const useAppInitialization = () => {
  // Check if we're in an active SPA session (client-side navigation)
  const isClientSideNavigation =
    typeof window !== "undefined"
      ? sessionStorage.getItem(SESSION_KEY) === "true"
      : false;

  const [showLoader, setShowLoader] = useState(!isClientSideNavigation);
  const [isInitialized, setIsInitialized] = useState(isClientSideNavigation);
  const [startTime] = useState(() => Date.now());

  // Get preload state only if we should show loader
  const preloadState = usePreloadAssets();
  const shouldPreload = showLoader;

  // Mark SPA navigation as active and handle cleanup
  useEffect(() => {
    // Mark SPA navigation as active
    sessionStorage.setItem(SESSION_KEY, "true");

    // Clear flag on page unload (refresh/close)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(SESSION_KEY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Handle initialization completion with minimum loading time
  useEffect(() => {
    if (shouldPreload && preloadState.isComplete) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      setTimeout(() => {
        // Mark app as initialized
        setIsInitialized(true);

        // Hide loader with small delay for smooth transition
        setTimeout(() => {
          setShowLoader(false);
        }, 500);
      }, remainingTime);
    }
  }, [shouldPreload, preloadState.isComplete, startTime]);

  return {
    showLoader,
    isInitialized,
    progress: shouldPreload ? preloadState.progress : 1,
    loadedAssets: shouldPreload ? preloadState.loadedAssets : 0,
    totalAssets: shouldPreload ? preloadState.totalAssets : 0,
    failedAssets: shouldPreload ? preloadState.failedAssets : 0,
  };
};

