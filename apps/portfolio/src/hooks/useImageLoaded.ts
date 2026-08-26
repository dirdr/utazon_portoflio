import { useState, useCallback } from "react";

/**
 * URLs decoded at least once this session. Survives unmount so a card
 * scrolling back into view does not replay its fade-in.
 */
const seen = new Set<string>();

export interface ImageLoadedState {
  loaded: boolean;
  error: boolean;
  onLoad: () => void;
  onError: () => void;
}

/**
 * Tracks a single <img> element's readiness. Unlike a preflight `new Image()`,
 * this reads the real element's events, so the browser fetches the file once.
 */
export const useImageLoaded = (src: string): ImageLoadedState => {
  const [loaded, setLoaded] = useState(() => seen.has(src));
  const [error, setError] = useState(false);

  const onLoad = useCallback(() => {
    seen.add(src);
    setLoaded(true);
  }, [src]);

  const onError = useCallback(() => {
    setError(true);
    setLoaded(true);
  }, []);

  return { loaded, error, onLoad, onError };
};
