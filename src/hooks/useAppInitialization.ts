import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { usePreloadAssets } from "./usePreloadAssets";

// Global singleton to ensure only one instance tracks first load
let globalIsFirstLoad = true;
// Track dive-in activation separately from fresh load state
let isDiveInActive = false;

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

  // Video behavior logic - updated to handle dive-in state properly
  const shouldPlayFromStart = isFreshLoad && isHomePage && !isDiveInActive;
  const shouldJumpTo8s = (!isFreshLoad || isDiveInActive) && isHomePage;
  const isDiveInFlow = isFreshLoad && isDiveInActive && isHomePage;

  console.log("🚀 useAppInitialization:", {
    location,
    isHomePage,
    globalIsFirstLoad,
    isFreshLoad,
    isDiveInActive,
    showLoader,
    showDiveInButton,
    preloadComplete: preloadState.isComplete,
    isFullyLoaded,
    shouldPlayFromStart,
    shouldJumpTo8s,
    isDiveInFlow
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

  // Handle dive-in workflow - reset global state only after video workflow completes
  useEffect(() => {
    if (isDiveInFlow) {
      console.log("🚀 Dive-in workflow active - maintaining fresh load state");
      // Set a timer to reset the global state after the dive-in workflow completes
      const timer = setTimeout(() => {
        console.log("🚀 Dive-in workflow complete - resetting global state");
        globalIsFirstLoad = false;
        isDiveInActive = false;
      }, 5000); // Give enough time for the video workflow to complete

      return () => clearTimeout(timer);
    }
  }, [isDiveInFlow]);

  // Reset global state when user navigates away from home page
  useEffect(() => {
    if (!isHomePage && (globalIsFirstLoad || isDiveInActive)) {
      console.log("🚀 User navigated away from home - resetting global state");
      globalIsFirstLoad = false;
      isDiveInActive = false;
    }
  }, [isHomePage]);

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
          // Don't reset globalIsFirstLoad yet - only reset when user interacts or navigates
          // This preserves fresh load state for dive-in functionality
        }, 500);
      }, remainingTime);
    }
  }, [shouldPreload, isFullyLoaded, startTime]);

  const hideDiveInButton = () => {
    console.log("🚀 hideDiveInButton called - activating dive-in workflow");
    setShowDiveInButton(false);
    // Mark dive-in as active but maintain fresh load state for proper video workflow
    isDiveInActive = true;
    // Don't reset globalIsFirstLoad here - let the workflow complete naturally
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
      shouldJumpTo8s,
      isDiveInFlow
    }
  };
};
