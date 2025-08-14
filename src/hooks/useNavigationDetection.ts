import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  detectNavigationType, 
  trackRouteChange, 
  markAppHydrated, 
  resetNavigationState,
  NavigationInfo
} from '../utils/navigationDetection';

interface NavigationState {
  isFreshLoad: boolean;
  navigationType: NavigationInfo['navigationType'];
  detectionMethod: NavigationInfo['method'];
  isInitialRender: boolean;
}

/**
 * Hook that integrates modern navigation detection with Wouter router
 * Provides accurate SPA vs fresh load detection for the entire app
 */
export const useNavigationDetection = () => {
  const [location] = useLocation();
  const [navigationState, setNavigationState] = useState<NavigationState>(() => {
    // Initial detection on first render
    const detection = detectNavigationType();
    console.log('[NAV_HOOK] Initial detection:', detection);
    
    return {
      isFreshLoad: detection.isFreshLoad,
      navigationType: detection.navigationType,
      detectionMethod: detection.method,
      isInitialRender: true
    };
  });

  const previousLocation = useRef<string>(location);
  const isHydrated = useRef(false);
  const hasDetectedInitialNavigation = useRef(false);

  // Track when React has finished initial hydration
  useEffect(() => {
    if (!isHydrated.current) {
      markAppHydrated();
      isHydrated.current = true;
    }
  }, []);

  // Monitor location changes and update navigation state accordingly
  useEffect(() => {
    const isLocationChange = previousLocation.current !== location;
    
    if (!hasDetectedInitialNavigation.current) {
      // First time this effect runs - this is the initial page/route
      console.log('[NAV_HOOK] Initial route detection for:', location);
      trackRouteChange(location, true);
      hasDetectedInitialNavigation.current = true;
    } else if (isLocationChange) {
      // Subsequent route changes - these are SPA navigations
      console.log('[NAV_HOOK] SPA navigation detected from', previousLocation.current, 'to', location);
      
      trackRouteChange(location, false);
      
      // Update state to reflect SPA navigation
      setNavigationState(prevState => ({
        ...prevState,
        isFreshLoad: false,
        navigationType: 'spa-navigation',
        detectionMethod: 'navigation-api', // We know this is SPA navigation
        isInitialRender: false
      }));
    }

    previousLocation.current = location;
  }, [location]);

  // Method to reset navigation state (call after successful navigation workflow)
  const resetNavigation = () => {
    resetNavigationState();
    setNavigationState(prevState => ({
      ...prevState,
      isFreshLoad: false,
      isInitialRender: false
    }));
    console.log('[NAV_HOOK] Navigation state reset - future navigations will be treated as SPA');
  };

  // Method to force re-detection (useful for debugging)
  const redetectNavigation = () => {
    const detection = detectNavigationType();
    setNavigationState({
      isFreshLoad: detection.isFreshLoad,
      navigationType: detection.navigationType,
      detectionMethod: detection.method,
      isInitialRender: false
    });
    console.log('[NAV_HOOK] Re-detection forced:', detection);
  };

  return {
    ...navigationState,
    resetNavigation,
    redetectNavigation,
    // Convenience properties
    isSPANavigation: !navigationState.isFreshLoad && !navigationState.isInitialRender,
    isPageReload: navigationState.navigationType === 'reload',
    isBackForward: navigationState.navigationType === 'back-forward',
    currentLocation: location
  };
};