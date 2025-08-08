import { useImageLoadState } from "./useImageLoadState";

/**
 * Hook to determine when a project page is ready to display
 * Coordinates with existing preload system for smooth transitions
 */
export const useProjectPageReady = (projectId: string) => {
  const backgroundImageSrc = `/images/projects/${projectId}/background.webp`;
  const { isLoaded } = useImageLoadState(backgroundImageSrc);
  
  return { isReady: isLoaded };
};