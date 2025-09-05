/**
 * Modern SPA Navigation Detection Utility
 * 
 * Industry-standard solution for detecting SPA navigation vs fresh page loads
 * using the latest web APIs in order of preference.
 */

export interface NavigationInfo {
  isFreshLoad: boolean;
  navigationType: 'fresh-load' | 'spa-navigation' | 'back-forward' | 'reload';
  method: 'navigation-api' | 'performance-timing' | 'document-ready' | 'fallback';
  details: Record<string, unknown>;
}

// Global state to track navigation across the app lifecycle
const globalNavigationState = {
  isFirstVisit: true,
  lastNavigationTime: 0,
  routeChangeCount: 0,
  isHydrating: true
};

/**
 * Method 1: Modern Navigation API (Chrome 102+, Edge 102+)
 * Most accurate method for detecting navigation types
 */
const detectWithNavigationAPI = (): NavigationInfo | null => {
  if (!('navigation' in window)) {
    return null;
  }

  try {
    const navigation = window.navigation as {
      currentEntry?: {
        id?: string;
        url?: string;
        navigationType?: string;
      };
      entries?: () => Array<{ id?: string }>;
    };

    if (!navigation.currentEntry) {
      return null;
    }

    const currentEntry = navigation.currentEntry;
    
    // Check if this is the first navigation entry
    const entries = (typeof navigation.entries === 'function' ? navigation.entries() : []);
    const isFirstEntry = entries.length === 1 && entries[0] === currentEntry;
    
    // Navigation API can tell us about navigation types more precisely
    const navigationType = currentEntry.navigationType || 'unknown';
    
    const details = {
      navigationType,
      entriesCount: entries.length,
      isFirstEntry,
      currentEntryId: currentEntry.id,
      url: currentEntry.url
    };

    // Fresh load indicators:
    // - First entry in navigation history
    // - navigationType is 'reload' or undefined (initial load)
    const isFreshLoad = isFirstEntry || navigationType === 'reload' || globalNavigationState.isFirstVisit;


    return {
      isFreshLoad,
      navigationType: isFreshLoad ? (navigationType === 'reload' ? 'reload' : 'fresh-load') : 'spa-navigation',
      method: 'navigation-api',
      details
    };
  } catch (error) {
    return null;
  }
};

/**
 * Method 2: Performance Navigation Timing API
 * Good fallback for modern browsers
 */
const detectWithPerformanceTiming = (): NavigationInfo | null => {
  try {
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (entries.length === 0) return null;

    const entry = entries[0];
    const details = {
      type: entry.type,
      loadEventEnd: entry.loadEventEnd,
      domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
      redirectCount: entry.redirectCount
    };

    // Check if this navigation happened recently (indicating it's related to current page)
    const navigationAge = performance.now() - entry.loadEventEnd;
    const isRecentNavigation = navigationAge < 1000; // Within 1 second

    // Fresh load indicators:
    // - type is 'reload' or 'navigate' (not 'back_forward')
    // - Recent navigation timing
    // - First visit flag
    const isFreshLoad = (
      (entry.type === 'reload' || entry.type === 'navigate') &&
      (isRecentNavigation || globalNavigationState.isFirstVisit)
    );


    return {
      isFreshLoad,
      navigationType: entry.type === 'reload' ? 'reload' : (isFreshLoad ? 'fresh-load' : 'spa-navigation'),
      method: 'performance-timing',
      details
    };
  } catch (error) {
    return null;
  }
};

/**
 * Method 3: Document Ready State + Timing Analysis
 * Analyzes when the script is running relative to page lifecycle
 */
const detectWithDocumentReady = (): NavigationInfo | null => {
  try {
    const now = performance.now();
    const details = {
      readyState: document.readyState,
      performanceNow: now,
      isHydrating: globalNavigationState.isHydrating,
      routeChangeCount: globalNavigationState.routeChangeCount,
      lastNavigationTime: globalNavigationState.lastNavigationTime
    };

    // Fresh load indicators:
    // - Script running very early in page lifecycle (< 100ms)
    // - Document is still loading or interactive
    // - First visit or very few route changes
    const isEarlyExecution = now < 100;
    const isDocumentLoading = document.readyState !== 'complete';
    const hasMinimalRouteChanges = globalNavigationState.routeChangeCount < 2;

    const isFreshLoad = (
      isEarlyExecution ||
      isDocumentLoading ||
      (hasMinimalRouteChanges && globalNavigationState.isFirstVisit)
    );


    return {
      isFreshLoad,
      navigationType: isFreshLoad ? 'fresh-load' : 'spa-navigation',
      method: 'document-ready',
      details
    };
  } catch (error) {
    return null;
  }
};

/**
 * Method 4: Fallback using global state
 * Last resort when other methods fail
 */
const detectWithFallback = (): NavigationInfo => {
  const details = {
    isFirstVisit: globalNavigationState.isFirstVisit,
    routeChangeCount: globalNavigationState.routeChangeCount,
    isHydrating: globalNavigationState.isHydrating
  };

  const isFreshLoad = globalNavigationState.isFirstVisit && globalNavigationState.routeChangeCount === 0;


  return {
    isFreshLoad,
    navigationType: isFreshLoad ? 'fresh-load' : 'spa-navigation',
    method: 'fallback',
    details
  };
};

/**
 * Main detection function - tries methods in order of preference
 */
export const detectNavigationType = (): NavigationInfo => {
  // Try detection methods in order of preference
  const detectionMethods = [
    detectWithNavigationAPI,
    detectWithPerformanceTiming,
    detectWithDocumentReady,
  ];

  for (const method of detectionMethods) {
    const result = method();
    if (result) {
      return result;
    }
  }

  // Fallback method always returns a result
  return detectWithFallback();
};

/**
 * Track SPA route changes
 * Call this when the router navigates to a new route
 */
export const trackRouteChange = (newPath: string, isInitialRender = false) => {
  const now = performance.now();
  
  if (!isInitialRender) {
    globalNavigationState.routeChangeCount++;
    globalNavigationState.lastNavigationTime = now;
    globalNavigationState.isHydrating = false;
  }

};

/**
 * Mark the app as fully hydrated
 * Call this after React has finished hydrating/mounting
 */
export const markAppHydrated = () => {
  globalNavigationState.isHydrating = false;
};

/**
 * Reset navigation state after successful navigation workflow
 * Call this after dive-in animation or SPA navigation is complete
 */
export const resetNavigationState = () => {
  globalNavigationState.isFirstVisit = false;
};

/**
 * Get current navigation state for debugging
 */
export const getNavigationState = () => ({ ...globalNavigationState });

/**
 * Initialize navigation detection
 * Call this early in app initialization
 */
export const initializeNavigationDetection = () => {
  // Mark hydration start
  globalNavigationState.isHydrating = true;
  
  // Listen for page visibility changes to detect back/forward navigation
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // Page became visible - could be back/forward navigation
      }
    });

    // Listen for popstate (back/forward button)
    window.addEventListener('popstate', (event) => {
      globalNavigationState.routeChangeCount++;
      globalNavigationState.lastNavigationTime = performance.now();
    });
  }

};