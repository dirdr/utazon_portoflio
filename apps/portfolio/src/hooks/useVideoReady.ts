import { useState, useCallback } from "react";

/**
 * Tracks whether a <video> can actually render frames, so a placeholder can be
 * held for the whole buffering period rather than only while a URL resolves.
 */
export const useVideoReady = () => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  const onCanPlay = useCallback(() => setReady(true), []);
  // Retire the placeholder on failure too, so the error state is reachable.
  const onError = useCallback(() => {
    setError(true);
    setReady(true);
  }, []);

  return { ready, error, onCanPlay, onError };
};
