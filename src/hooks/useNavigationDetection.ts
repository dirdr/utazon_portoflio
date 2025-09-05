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

  useEffect(() => {
    if (!isHydrated.current) {
      markAppHydrated();
      isHydrated.current = true;
    }
  }, []);

  useEffect(() => {
    const isLocationChange = previousLocation.current !== location;
    
    if (!hasDetectedInitialNavigation.current) {
      trackRouteChange(location, true);
      hasDetectedInitialNavigation.current = true;
    } else if (isLocationChange) {
      
      trackRouteChange(location, false);
      
      setNavigationState(prevState => ({
        ...prevState,
        isFreshLoad: false,
        navigationType: 'spa-navigation',
        detectionMethod: 'navigation-api',
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