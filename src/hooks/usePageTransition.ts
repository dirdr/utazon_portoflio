import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

interface PageTransitionConfig {
  transitionDuration?: number;
  cacheVerificationUrls?: string[];
}

interface PageTransitionState {
  isTransitioning: boolean;
  isPageReady: boolean;
  progress: number;
  currentPage: string;
  previousPage: string | null;
}

/**
 * Global page transition system with integrated cache verification
 * Provides smooth transitions between all pages in the SPA
 */
export const usePageTransition = (config: PageTransitionConfig = {}) => {
  const {
    transitionDuration = 600,
    cacheVerificationUrls = [],
  } = config;

  const [location] = useLocation();
  const [state, setState] = useState<PageTransitionState>({
    isTransitioning: false,
    isPageReady: true, // Start ready for initial load
    progress: 100,
    currentPage: location,
    previousPage: null,
  });

  const [transitionStartTime, setTransitionStartTime] = useState<number>(0);

  // Cache verification function
  const verifyCacheUrls = useCallback(
    (urls: string[]): Promise<void> => {
      if (urls.length === 0) return Promise.resolve();

      return new Promise((resolve) => {
        let completedCount = 0;
        const totalCount = urls.length;

        const updateProgress = () => {
          const progress = (completedCount / totalCount) * 100;
          setState(prev => ({ ...prev, progress: progress * 0.8 + 20 })); // 20-100% range
        };

        const checkComplete = () => {
          completedCount++;
          updateProgress();
          if (completedCount === totalCount) {
            resolve();
          }
        };

        // Safari/Firefox specific cache coordination
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

        urls.forEach((url, index) => {
          const img = new Image();
          
          const handleLoad = () => checkComplete();
          const handleError = () => checkComplete(); // Don't block on errors

          img.addEventListener('load', handleLoad);
          img.addEventListener('error', handleError);

          if (isSafari || isFirefox) {
            img.crossOrigin = 'anonymous';
            // Stagger requests to avoid overwhelming cache
            setTimeout(() => {
              img.src = url;
            }, index * 20);
          } else {
            img.src = url;
          }
        });
      });
    },
    []
  );

  // Handle page transitions
  useEffect(() => {
    if (location === state.currentPage) return;

    // Start transition
    const startTime = Date.now();
    setTransitionStartTime(startTime);
    
    setState(prev => ({
      ...prev,
      isTransitioning: true,
      isPageReady: false,
      progress: 0,
      previousPage: prev.currentPage,
    }));

    const executeTransition = async () => {
      // Phase 1: Fade in overlay
      await new Promise(resolve => setTimeout(resolve, transitionDuration / 2));
      setState(prev => ({ ...prev, progress: 50 }));
      
      // Phase 2: Cache verification during overlay
      await verifyCacheUrls(cacheVerificationUrls);
      setState(prev => ({ ...prev, progress: 100 }));
      
      // Phase 3: Small delay then fade out
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Complete transition - starts fade out
      setState(prev => ({
        ...prev,
        isTransitioning: false,
        isPageReady: true,
        currentPage: location,
      }));
    };

    executeTransition();
  }, [location, state.currentPage, cacheVerificationUrls, transitionDuration, verifyCacheUrls]);

  const startManualTransition = useCallback(
    (targetPage: string, urls: string[] = []) => {
      // For programmatic navigation with custom cache verification
      return new Promise<void>((resolve) => {
        setState(prev => ({
          ...prev,
          isTransitioning: true,
          isPageReady: false,
          progress: 0,
          previousPage: prev.currentPage,
        }));

        const executeManualTransition = async () => {
          setState(prev => ({ ...prev, progress: 20 }));
          await verifyCacheUrls(urls);
          
          setState(prev => ({
            ...prev,
            isTransitioning: false,
            isPageReady: true,
            progress: 100,
            currentPage: targetPage,
          }));
          
          resolve();
        };

        executeManualTransition();
      });
    },
    [verifyCacheUrls]
  );

  return {
    ...state,
    transitionDuration,
    startManualTransition,
  };
};