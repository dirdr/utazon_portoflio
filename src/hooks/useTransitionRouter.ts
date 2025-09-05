import { useState, useCallback, useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import { getRouteAssets, shouldPreloadRoute } from '../config/routeAssets';
import { useLocomotiveScrollContext } from '../contexts/LocomotiveScrollContext';
import { scrollPositionStore } from '../stores/scrollPositionStore';

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
  preservedScrollPosition: number;
}

/**
 * Router that intercepts navigation and handles smooth transitions
 * Implements proper SPA transition pattern: fade current → switch → fade new
 */
export const useTransitionRouter = (config: TransitionConfig = {}) => {
  const { duration = 600 } = config;
  const [location, setLocation] = useLocation();
  
  // Use locomotive scroll if available, fallback to regular scroll
  let locomotiveScroll = null;
  try {
    locomotiveScroll = useLocomotiveScrollContext();
  } catch {
    // Locomotive scroll context not available, will use fallback
  }
  
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    currentLocation: location,
    pendingLocation: null,
    progress: 0,
    fadeInComplete: false,
    preservedScrollPosition: 0,
  });

  // Cache verification function
  const verifyCacheUrls = useCallback((urls: string[]): Promise<void> => {
    if (urls.length === 0) return Promise.resolve();

    return new Promise((resolve) => {
      let completedCount = 0;
      const totalCount = urls.length;

      const checkComplete = () => {
        completedCount++;
        const progress = (completedCount / totalCount) * 100;
        setState(prev => ({ 
          ...prev, 
          progress: 50 + (progress * 0.4) // 50-90% range during cache verification
        }));
        
        if (completedCount === totalCount) {
          resolve();
        }
      };

      // Safari/Firefox cache coordination
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

      urls.forEach((url, index) => {
        const img = new Image();
        
        img.addEventListener('load', checkComplete);
        img.addEventListener('error', checkComplete);

        if (isSafari || isFirefox) {
          img.crossOrigin = 'anonymous';
          setTimeout(() => {
            img.src = url;
          }, index * 15);
        } else {
          img.src = url;
        }
      });
    });
  }, []);

  // Callback for when fade-in completes
  const handleFadeInComplete = useCallback(async () => {
    if (!state.pendingLocation) {
      return;
    }

    const blackScreenStartTime = Date.now();
    const minBlackScreenDuration = duration / 3; // Minimum 200ms for 600ms total
    
    const newLocation = state.pendingLocation;
    const shouldPreload = shouldPreloadRoute(newLocation);
    const cacheUrls = shouldPreload ? getRouteAssets(newLocation) : [];


    setState(prev => ({ ...prev, progress: 50 }));

    // Phase 3: Switch routes during black screen
    
    setLocation(newLocation);
    setState(prev => ({ 
      ...prev, 
      currentLocation: newLocation,
      progress: 60,
    }));
    

    // Phase 4: Cache verification (only if needed)
    if (cacheUrls.length > 0) {
      await verifyCacheUrls(cacheUrls);
    }
    setState(prev => ({ ...prev, progress: 90 }));

    if (newLocation === '/') {
      await preloadHomeVideo();
    }
    
    // Phase 6: Ensure minimum black screen duration for smooth transitions
    const processingTime = Date.now() - blackScreenStartTime;
    const remainingTime = Math.max(0, minBlackScreenDuration - processingTime);
    
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime));
    }
    
    setState(prev => ({ ...prev, progress: 100 }));

    // Phase 6: Complete transition - start fade out
    setState(prev => ({
      ...prev,
      isTransitioning: false,
      pendingLocation: null,
      fadeInComplete: false,
      preservedScrollPosition: 0,
    }));
    
    // End transition in scroll store
    scrollPositionStore.endTransition();
  }, [state.pendingLocation, setLocation, verifyCacheUrls, duration, locomotiveScroll]);

  // Navigate with transition (automatically determines assets to preload)
  const navigateWithTransition = useCallback(async (
    newLocation: string, 
    routeParams?: Record<string, string>
  ) => {
    if (newLocation === state.currentLocation) {
      return;
    }
    
    // Preserve scroll position for the transition
    scrollPositionStore.startTransition();
    const currentScrollY = scrollPositionStore.getPosition();
    
    
    // Phase 1: Start transition - fade in overlay
    setState(prev => ({
      ...prev,
      isTransitioning: true,
      pendingLocation: newLocation,
      progress: 0,
      fadeInComplete: false,
      preservedScrollPosition: currentScrollY,
    }));
    

    // Phase 2: Fade-in completion is handled by handleFadeInComplete callback

  }, [state.currentLocation, duration, locomotiveScroll]);

  // Simple navigate (no transition, for same-page or immediate changes)
  const navigate = useCallback((newLocation: string) => {
    setLocation(newLocation);
    setState(prev => ({ ...prev, currentLocation: newLocation }));
  }, [setLocation]);

  // Sync with external location changes (back/forward buttons)
  useEffect(() => {
    if (location !== state.currentLocation && !state.isTransitioning) {
      setState(prev => ({ ...prev, currentLocation: location }));
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