import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';

const SPA_SESSION_KEY = 'spa-navigation-active';

export const useNavigationType = () => {
  const [location] = useLocation();
  
  // Use the same logic as the global loader: check if SPA session is active
  const isClientSideNavigation = typeof window !== 'undefined' 
    ? sessionStorage.getItem(SPA_SESSION_KEY) === 'true' 
    : false;

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Mark SPA navigation as active (same as global loader)
    sessionStorage.setItem(SPA_SESSION_KEY, 'true');
    
    // Clear flag on page unload (refresh/close)
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(SPA_SESSION_KEY);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    setIsInitialized(true);
    
    console.log('🧭 Navigation type detected:', {
      isClientSideNavigation,
      isFreshLoad: !isClientSideNavigation,
      location
    });

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    isInternalNavigation: isClientSideNavigation,
    isInitialized,
    isFreshLoad: isInitialized && !isClientSideNavigation
  };
};