import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getRouteAssets, shouldPreloadRoute } from '../config/routeAssets';

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

/**
 * Router that intercepts navigation and handles smooth transitions
 * Implements proper SPA transition pattern: fade current → switch → fade new
 */
export const useTransitionRouter = (config: TransitionConfig = {}) => {
  const { duration = 600 } = config;
  const [location, setLocation] = useLocation();
  
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    currentLocation: location,
    pendingLocation: null,
    progress: 0,
    fadeInComplete: false,
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
    console.log('🎬 TransitionRouter: handleFadeInComplete called', { 
      pendingLocation: state.pendingLocation,
      isTransitioning: state.isTransitioning 
    });

    if (!state.pendingLocation) {
      console.log('❌ TransitionRouter: No pending location, aborting');
      return;
    }

    const newLocation = state.pendingLocation;
    console.log('🔄 TransitionRouter: Starting route switch to', newLocation);
    const shouldPreload = shouldPreloadRoute(newLocation);
    const cacheUrls = shouldPreload ? getRouteAssets(newLocation) : [];

    setState(prev => ({ ...prev, progress: 50 }));

    // Phase 3: Switch routes during black screen
    console.log('🎯 TransitionRouter: Switching to new route:', newLocation);
    setLocation(newLocation);
    setState(prev => ({ 
      ...prev, 
      currentLocation: newLocation,
      progress: 60,
    }));
    console.log('✅ TransitionRouter: Route switched successfully');

    // Phase 4: Cache verification (only if needed)
    if (cacheUrls.length > 0) {
      await verifyCacheUrls(cacheUrls);
    }
    setState(prev => ({ ...prev, progress: 90 }));

    // Phase 5: Small buffer then fade out
    await new Promise(resolve => setTimeout(resolve, 100));
    setState(prev => ({ ...prev, progress: 100 }));

    // Phase 6: Complete transition - start fade out
    console.log('🏁 TransitionRouter: Completing transition - fade out');
    setState(prev => ({
      ...prev,
      isTransitioning: false,
      pendingLocation: null,
      fadeInComplete: false,
    }));
    console.log('✨ TransitionRouter: Transition completed successfully');
  }, [state.pendingLocation, setLocation, verifyCacheUrls]);

  // Navigate with transition (automatically determines assets to preload)
  const navigateWithTransition = useCallback(async (
    newLocation: string, 
    routeParams?: Record<string, string>
  ) => {
    console.log('🚀 TransitionRouter: navigateWithTransition called', { 
      newLocation, 
      currentLocation: state.currentLocation,
      isTransitioning: state.isTransitioning 
    });

    if (newLocation === state.currentLocation) {
      console.log('⏭️ TransitionRouter: Same location, skipping transition');
      return;
    }

    console.log('▶️ TransitionRouter: Starting transition - Phase 1');
    // Phase 1: Start transition - fade in overlay
    setState(prev => ({
      ...prev,
      isTransitioning: true,
      pendingLocation: newLocation,
      progress: 0,
      fadeInComplete: false,
    }));

    // Phase 2: Fade-in completion is handled by handleFadeInComplete callback

  }, [state.currentLocation]);

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