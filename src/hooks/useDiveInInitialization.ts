import { useState, useEffect } from "react";

const SESSION_KEY = "dive-in-navigation-active";

/**
 * Custom hook to manage dive-in button state
 * Shows dive-in button only on page refresh/first visit to home, not on SPA navigation
 * Uses the same session flag pattern as useAppInitialization for consistency
 */
export const useDiveInInitialization = () => {
  // Check if we're in an active SPA session (client-side navigation)
  const isClientSideNavigation =
    typeof window !== "undefined"
      ? sessionStorage.getItem(SESSION_KEY) === "true"
      : false;

  const [showDiveInButton, setShowDiveInButton] = useState(!isClientSideNavigation);
  const [isInitialized, setIsInitialized] = useState(isClientSideNavigation);

  // Mark SPA navigation as active and handle cleanup
  useEffect(() => {
    console.log('🚀 useDiveInInitialization - useEffect start:', {
      sessionKey: SESSION_KEY,
      sessionValue: sessionStorage.getItem(SESSION_KEY),
      isClientSideNavigation,
      initialShowDiveInButton: !isClientSideNavigation
    });

    // Mark SPA navigation as active
    sessionStorage.setItem(SESSION_KEY, "true");

    // Clear flag on page unload (refresh/close)
    const handleBeforeUnload = () => {
      console.log('🚀 useDiveInInitialization - beforeunload, clearing session');
      sessionStorage.removeItem(SESSION_KEY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    setIsInitialized(true);
    
    console.log('🚀 useDiveInInitialization - final state:', {
      isClientSideNavigation,
      showDiveInButton: !isClientSideNavigation,
      isInitialized: true,
      sessionAfterSet: sessionStorage.getItem(SESSION_KEY)
    });
    
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isClientSideNavigation]);

  const hideDiveInButton = () => {
    setShowDiveInButton(false);
  };

  return {
    showDiveInButton,
    hideDiveInButton,
    isInitialized,
    isFreshLoad: !isClientSideNavigation
  };
};