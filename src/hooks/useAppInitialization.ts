import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePreloadAssets } from "./usePreloadAssets";

// Global singleton to ensure only one instance tracks first load
let globalIsFirstLoad = true;

const MIN_LOADING_TIME = 1500; // Updated to 1.5s as recommended

/**
 * Unified hook to manage both app initialization and dive-in functionality
 * Handles preloading, loading states, and dive-in button logic in one place
 */
export const useAppInitialization = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  
  // Capture the global state immediately - this is our fresh load detection
  const isFreshLoad = globalIsFirstLoad;
  
  const [showLoader, setShowLoader] = useState(isFreshLoad);
  const [showDiveInButton, setShowDiveInButton] = useState(false); // Initialize as false, handle in useEffect
  const [isInitialized, setIsInitialized] = useState(!isFreshLoad);
  const [startTime] = useState(() => Date.now());

  const preloadState = usePreloadAssets();
  const shouldPreload = showLoader;
  
  // Only check preload state
  const isFullyLoaded = preloadState.isComplete;

  // Video behavior logic
  const shouldPlayFromStart = isFreshLoad && isHomePage;
  const shouldJumpTo8s = !isFreshLoad && isHomePage;

  console.log("🚀 useAppInitialization:", {
    location,
    isHomePage,
    globalIsFirstLoad,
    isFreshLoad,
    showLoader,
    showDiveInButton,
    preloadComplete: preloadState.isComplete,
    isFullyLoaded,
    shouldPlayFromStart,
    shouldJumpTo8s
  });

  // Handle showDiveInButton in useEffect, not useState - this ensures proper timing
  useEffect(() => {
    if (isFreshLoad && isHomePage && isFullyLoaded) {
      console.log("🚀 Setting showDiveInButton to true - fully loaded");
      setShowDiveInButton(true);
    }
  }, [isFreshLoad, isHomePage, isFullyLoaded]);

  // Handle SPA navigation - immediate show for non-fresh loads
  useEffect(() => {
    if (!isFreshLoad) {
      console.log("🚀 SPA navigation detected - showing content immediately");
      setShowDiveInButton(false);
      setShowLoader(false);
      setIsInitialized(true);
    }
  }, [isFreshLoad]);

  // Handle preload completion - deterministic timing (including auth)
  useEffect(() => {
    if (shouldPreload && isFullyLoaded) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      console.log("🚀 Fully loaded - setting timers:", {
        elapsedTime,
        remainingTime,
        minLoadingTime: MIN_LOADING_TIME
      });

      setTimeout(() => {
        console.log("🚀 Setting isInitialized to true");
        setIsInitialized(true);

        setTimeout(() => {
          console.log("🚀 Setting showLoader to false");
          setShowLoader(false);
          // Only now mark first load as done - deterministic timing
          globalIsFirstLoad = false;
        }, 500);
      }, remainingTime);
    }
  }, [shouldPreload, isFullyLoaded, startTime]);

  const hideDiveInButton = () => {
    console.log("🚀 hideDiveInButton called");
    setShowDiveInButton(false);
  };

  return {
    // Legacy loader properties
    showLoader,
    isInitialized,
    progress: shouldPreload ? preloadState.progress : 1,
    loadedAssets: shouldPreload ? preloadState.loadedAssets : 0,
    totalAssets: shouldPreload ? preloadState.totalAssets : 0,
    failedAssets: shouldPreload ? preloadState.failedAssets : 0,
    
    // Dive-in properties
    showDiveInButton,
    hideDiveInButton,
    isFreshLoad,
    
    // Video behavior properties
    videoBehavior: {
      shouldPlayFromStart,
      shouldJumpTo8s
    }
  };
};
