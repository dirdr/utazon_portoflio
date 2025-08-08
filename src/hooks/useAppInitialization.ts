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


  // Handle showDiveInButton in useEffect, not useState - this ensures proper timing
  useEffect(() => {
    if (isFreshLoad && isHomePage && isFullyLoaded) {
      setShowDiveInButton(true);
    }
  }, [isFreshLoad, isHomePage, isFullyLoaded]);

  // Handle SPA navigation - immediate show for non-fresh loads
  useEffect(() => {
    if (!isFreshLoad) {
      setShowDiveInButton(false);
      setShowLoader(false);
      setIsInitialized(true);
    }
  }, [isFreshLoad]);

  // Handle dive-in workflow - reset global state only after video workflow completes
  useEffect(() => {
    if (isDiveInFlow) {
      // Set a timer to reset the global state after the dive-in workflow completes
      const timer = setTimeout(() => {
        globalIsFirstLoad = false;
        isDiveInActive = false;
      }, 5000); // Give enough time for the video workflow to complete

      return () => clearTimeout(timer);
    }
  }, [isDiveInFlow]);

  // Reset global state when user navigates away from home page
  // But only for SPA navigation, not fresh loads to non-home pages
  useEffect(() => {
    if (!isHomePage && !isFreshLoad && (globalIsFirstLoad || isDiveInActive)) {
      globalIsFirstLoad = false;
      isDiveInActive = false;
    }
  }, [isHomePage, isFreshLoad]);

  // Handle preload completion - deterministic timing (including auth)
  useEffect(() => {
    if (shouldPreload && isFullyLoaded) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      setTimeout(() => {
        setIsInitialized(true);

        setTimeout(() => {
          setShowLoader(false);
          
          // Reset global state for non-home pages after loading completes
          // For home page, preserve fresh load state for dive-in functionality
          if (!isHomePage && isFreshLoad) {
            globalIsFirstLoad = false;
            isDiveInActive = false;
          }
        }, 500);
      }, remainingTime);
    }
  }, [shouldPreload, isFullyLoaded, startTime, isHomePage, isFreshLoad]);

  const hideDiveInButton = () => {
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
