import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import { usePreloadAssets } from "./usePreloadAssets";
import { useNavigationDetection } from "./useNavigationDetection";
import { initializeNavigationDetection } from "../utils/navigationDetection";

let isDiveInActive = false;

const MIN_LOADING_TIME = 1500;

/**
 * Unified hook to manage both app initialization and dive-in functionality
 * Handles preloading, loading states, and dive-in button logic in one place
 */
export const useAppInitialization = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      initializeNavigationDetection();
      isInitialized.current = true;
    }
  }, []);

  const navigation = useNavigationDetection();
  const isFreshLoad = navigation.isFreshLoad;

  const [showLoader, setShowLoader] = useState(isFreshLoad);
  const [showDiveInButton, setShowDiveInButton] = useState(false);
  const [isAppInitialized, setIsAppInitialized] = useState(!isFreshLoad);
  const [startTime] = useState(() => Date.now());

  const preloadState = usePreloadAssets();
  const shouldPreload = showLoader;

  const videoBehavior = useMemo(
    () => ({
      shouldPlayFromStart: isFreshLoad && isHomePage && !isDiveInActive,
      isDiveInFlow: isFreshLoad && isHomePage && isDiveInActive,
    }),
    [isFreshLoad, isHomePage],
  );

  useEffect(() => {
    if (isFreshLoad) {
      preloadState.startPreloading();
    }
  }, [isFreshLoad, preloadState]);

  useEffect(() => {
    if (!isFreshLoad && navigation.isSPANavigation) {
      setShowDiveInButton(false);
      setShowLoader(false);
      setIsAppInitialized(true);
      isDiveInActive = false;
    }
  }, [isFreshLoad, navigation.isSPANavigation]);

  useEffect(() => {
    if (isFreshLoad) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      const timer = setTimeout(() => {
        setIsAppInitialized(true);

        if (isHomePage) {
          setShowDiveInButton(true);
        }

        setTimeout(() => {
          setShowLoader(false);

          if (!isHomePage) {
            navigation.resetNavigation();
            isDiveInActive = false;
          }
        }, 500);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isFreshLoad, startTime, isHomePage, navigation]);

  useEffect(() => {
    if (videoBehavior.isDiveInFlow) {
      const timer = setTimeout(() => {
        navigation.resetNavigation();
        isDiveInActive = false;
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [videoBehavior.isDiveInFlow, navigation]);

  const hideDiveInButton = useCallback(() => {
    setShowDiveInButton(false);
    isDiveInActive = true;
  }, []);

  return {
    showLoader,
    isInitialized: isAppInitialized,
    progress: shouldPreload ? preloadState.progress : 1,
    loadedAssets: shouldPreload ? preloadState.loadedAssets : 0,
    totalAssets: shouldPreload ? preloadState.totalAssets : 0,
    failedAssets: shouldPreload ? preloadState.failedAssets : 0,

    isFreshLoad,
    navigationType: navigation.navigationType,
    detectionMethod: navigation.detectionMethod,
    isSPANavigation: navigation.isSPANavigation,

    showDiveInButton,
    hideDiveInButton,

    videoBehavior,
  };
};
