import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { usePreloadAssets } from '../hooks/usePreloadAssets';

interface AppState {
  // Navigation state
  isFirstLoad: boolean;
  isHomePage: boolean;
  
  // Loading state
  showLoader: boolean;
  isInitialized: boolean;
  
  // Dive-in state
  showDiveInButton: boolean;
  
  // Video behavior
  shouldPlayFromStart: boolean;
  shouldJumpTo8s: boolean;
  
  // Preload state
  preloadComplete: boolean;
  progress: number;
  
  // Actions
  hideDiveInButton: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

const MIN_LOADING_TIME = 1500;

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const isHomePage = location === '/';
  
  // Use performance.now() to detect fresh loads vs HMR reloads
  const isFirstLoad = (() => {
    if (typeof window === 'undefined') return false;
    
    // Get performance timing - fresh loads have recent navigationStart
    const now = performance.now();
    const hasRecentNavigationStart = now < 5000; // Less than 5 seconds since navigation start
    
    // Check if we have a stored app start time from this session
    const appStartTime = sessionStorage.getItem('app-start-time');
    const currentTime = Date.now().toString();
    
    let shouldShowDiveIn = false;
    
    if (!appStartTime) {
      // No start time recorded - definitely first load
      shouldShowDiveIn = true;
      sessionStorage.setItem('app-start-time', currentTime);
    } else {
      // Check if this is a genuine page reload (navigation start is recent)
      if (hasRecentNavigationStart) {
        // Recent navigation start - likely a genuine refresh
        shouldShowDiveIn = true;
        sessionStorage.setItem('app-start-time', currentTime);
      } else {
        // Old navigation start - likely HMR or SPA navigation
        shouldShowDiveIn = false;
      }
    }
    
    console.log('🎯 Navigation detection:', {
      now,
      hasRecentNavigationStart,
      appStartTime,
      currentLocation: location,
      isFirstLoad: shouldShowDiveIn
    });
    
    return shouldShowDiveIn;
  })();

  const [showLoader, setShowLoader] = useState(isFirstLoad);
  const [showDiveInButton, setShowDiveInButton] = useState(false);
  const [isInitialized, setIsInitialized] = useState(!isFirstLoad);
  const [startTime] = useState(() => Date.now());

  const preloadState = usePreloadAssets();
  const shouldPreload = showLoader;

  // Video behavior logic
  const shouldPlayFromStart = isFirstLoad && isHomePage;
  const shouldJumpTo8s = !isFirstLoad && isHomePage;

  console.log('🎯 AppStateProvider:', {
    location,
    isHomePage,
    isFirstLoad,
    showLoader,
    showDiveInButton,
    preloadComplete: preloadState.isComplete,
    shouldPlayFromStart,
    shouldJumpTo8s
  });

  // Handle non-first loads immediately
  useEffect(() => {
    if (!isFirstLoad) {
      setShowLoader(false);
      setIsInitialized(true);
      setShowDiveInButton(false);
    }
  }, [isFirstLoad]);

  // Handle dive-in button appearance after preload
  useEffect(() => {
    if (isFirstLoad && isHomePage && preloadState.isComplete && isInitialized) {
      console.log('🎯 Showing dive-in button - all conditions met');
      setShowDiveInButton(true);
    }
  }, [isFirstLoad, isHomePage, preloadState.isComplete, isInitialized]);

  // Handle preload completion and loader timing
  useEffect(() => {
    if (shouldPreload && preloadState.isComplete) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      console.log('🎯 Preload complete, timing:', {
        elapsedTime,
        remainingTime,
        minLoadingTime: MIN_LOADING_TIME
      });

      setTimeout(() => {
        console.log('🎯 Setting isInitialized to true');
        setIsInitialized(true);

        setTimeout(() => {
          console.log('🎯 Setting showLoader to false');
          setShowLoader(false);
        }, 500);
      }, remainingTime);
    }
  }, [shouldPreload, preloadState.isComplete, startTime]);

  // Reset global flag on page unload (browser refresh/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log('🎯 Page unloading - will reset first mount flag');
      // The global flag will reset when the page actually reloads
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const hideDiveInButton = () => {
    console.log('🎯 Hiding dive-in button');
    setShowDiveInButton(false);
  };

  const value: AppState = {
    // Navigation state
    isFirstLoad,
    isHomePage,
    
    // Loading state
    showLoader,
    isInitialized,
    
    // Dive-in state
    showDiveInButton,
    
    // Video behavior
    shouldPlayFromStart,
    shouldJumpTo8s,
    
    // Preload state
    preloadComplete: preloadState.isComplete,
    progress: shouldPreload ? preloadState.progress : 1,
    
    // Actions
    hideDiveInButton
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppState => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};