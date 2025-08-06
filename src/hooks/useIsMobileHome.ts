import { useIsMobileSimple } from './useIsMobile';

/**
 * Simplified mobile detection hook specifically for home page behavior.
 * Determines whether to use mobile video experience (no sequencing/animations) 
 * vs desktop experience (full sequencing with dive-in button).
 * 
 * Uses the existing mobile detection but provides a clear, focused API
 * for home page conditional rendering.
 */
export const useIsMobileHome = (): boolean => {
  return useIsMobileSimple({
    breakpoint: 768, // Tablets and phones get mobile experience
    treatTabletsAsMobile: true
  });
};