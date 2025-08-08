import { useState, useEffect } from "react";

interface ImageLoadState {
  isLoaded: boolean;
  hasError: boolean;
}

/**
 * Bridge hook that checks if an image is ready to display
 * Leverages browser cache from existing preload system during SPA navigation
 */
export const useImageLoadState = (src: string): ImageLoadState => {
  const [state, setState] = useState<ImageLoadState>({
    isLoaded: false,
    hasError: false,
  });

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    
    const handleLoad = () => {
      setState({ isLoaded: true, hasError: false });
    };
    
    const handleError = () => {
      setState({ isLoaded: false, hasError: true });
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    img.src = src;

    // Cleanup
    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src]);

  return state;
};