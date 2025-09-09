import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { usePreloadAssets } from "./usePreloadAssets";
import { useNavigationDetection } from "./useNavigationDetection";
import { initializeNavigationDetection } from "../utils/navigationDetection";

// Track dive-in activation separately from fresh load state
let isDiveInActive = false;

const MIN_LOADING_TIME = 1500; // Minimum loader display time

/**
 * Unified hook to manage both app initialization and dive-in functionality
 * Handles preloading, loading states, and dive-in button logic in one place
 */
export const useAppInitialization = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isInitialized = useRef(false);
  
  // Initialize navigation detection system on first use
  useEffect(() => {
    if (!isInitialized.current) {
      initializeNavigationDetection();
      isInitialized.current = true;
    }
  }, []);
  
  // Navigation detection
  const navigation = useNavigationDetection();
  const isFreshLoad = navigation.isFreshLoad;
  
  // Component state
  const [showLoader, setShowLoader] = useState(isFreshLoad);
  const [showDiveInButton, setShowDiveInButton] = useState(false);
  const [isAppInitialized, setIsAppInitialized] = useState(!isFreshLoad);
  const [startTime] = useState(() => Date.now());

  // Asset preloading
  const preloadState = usePreloadAssets();
  const shouldPreload = showLoader;
  const isAssetsLoaded = preloadState.isComplete;

  // Video behavior logic - memoized for performance
  const videoBehavior = useMemo(() => ({
    shouldPlayFromStart: isFreshLoad && isHomePage && !isDiveInActive,
    isDiveInFlow: isFreshLoad && isHomePage && isDiveInActive
  }), [isFreshLoad, isHomePage]);
  

  // Handle SPA navigation - immediate ready state for non-fresh loads
  useEffect(() => {
    if (!isFreshLoad && navigation.isSPANavigation) {
      setShowDiveInButton(false);
      setShowLoader(false);
      setIsAppInitialized(true);
      // Reset dive-in state for clean SPA navigation
      isDiveInActive = false;
    }
  }, [isFreshLoad, navigation.isSPANavigation]);

  // Show dive-in button when loading completes on fresh home page load
  useEffect(() => {
    if (isFreshLoad && isHomePage && isAssetsLoaded) {
      setShowDiveInButton(true);
    }
  }, [isFreshLoad, isHomePage, isAssetsLoaded]);

  // Handle dive-in workflow completion - reset navigation state after video completes
  useEffect(() => {
    if (videoBehavior.isDiveInFlow) {
      const timer = setTimeout(() => {
        navigation.resetNavigation();
        isDiveInActive = false;
      }, 5000); // Give time for video workflow to complete

      return () => clearTimeout(timer);
    }
  }, [videoBehavior.isDiveInFlow, navigation]);

  // Handle preload completion with minimum loading time enforcement
  useEffect(() => {
    if (shouldPreload && isAssetsLoaded) {
      const elapsedTime = Date.now() - startTime;
      // Skip minimum loading time for SPA navigation
      const remainingTime = isFreshLoad ? Math.max(0, MIN_LOADING_TIME - elapsedTime) : 0;

      setTimeout(() => {
        setIsAppInitialized(true);

        setTimeout(() => {
          setShowLoader(false);
          
          // Reset navigation state for non-home pages after loading completes
          if (!isHomePage && isFreshLoad) {
            navigation.resetNavigation();
            isDiveInActive = false;
          }
        }, isFreshLoad ? 500 : 0); // Small delay only for fresh load
      }, remainingTime);
    }
  }, [shouldPreload, isAssetsLoaded, startTime, isHomePage, isFreshLoad, location, navigation]);

  const hideDiveInButton = useCallback(() => {
    setShowDiveInButton(false);
    // Mark dive-in as active but maintain fresh load state for proper video workflow
    isDiveInActive = true;
  }, []);

  return {
    // Legacy loader properties
    showLoader,
    isInitialized: isAppInitialized,
    progress: shouldPreload ? preloadState.progress : 1,
    loadedAssets: shouldPreload ? preloadState.loadedAssets : 0,
    totalAssets: shouldPreload ? preloadState.totalAssets : 0,
    failedAssets: shouldPreload ? preloadState.failedAssets : 0,
    
    // Navigation properties (enhanced with modern detection)
    isFreshLoad,
    navigationType: navigation.navigationType,
    detectionMethod: navigation.detectionMethod,
    isSPANavigation: navigation.isSPANavigation,
    
    // Dive-in properties
    showDiveInButton,
    hideDiveInButton,
    
    // Video behavior properties
    videoBehavior
  };
};
