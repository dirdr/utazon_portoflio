/**
 * Simple utility to track dive-in completion across SPA navigation only
 * Resets on every page refresh/reload but persists during SPA navigation
 */

const PAGE_LOAD_KEY = 'page_load_id';

// Generate a unique ID for this page load
const getCurrentPageLoadId = (): string => {
  try {
    let pageLoadId = sessionStorage.getItem(PAGE_LOAD_KEY);
    if (!pageLoadId) {
      // First time in this session - generate new ID
      pageLoadId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem(PAGE_LOAD_KEY, pageLoadId);
    }
    return pageLoadId;
  } catch {
    return 'fallback';
  }
};

// Track the page load ID when dive-in was completed
let diveInPageLoadId: string | null = null;

/**
 * Check if dive-in has been completed in this page load session
 */
export const isDiveInCompleted = (): boolean => {
  try {
    const currentPageLoadId = getCurrentPageLoadId();
    
    // If we haven't marked dive-in as completed, or it was from a different page load, return false
    if (!diveInPageLoadId || diveInPageLoadId !== currentPageLoadId) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

/**
 * Mark dive-in as completed for this page load session
 */
export const markDiveInCompleted = (): void => {
  try {
    const currentPageLoadId = getCurrentPageLoadId();
    diveInPageLoadId = currentPageLoadId;
  } catch {
    // Silently fail in environments without sessionStorage
  }
};