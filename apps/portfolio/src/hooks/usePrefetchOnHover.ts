import { useCallback, useRef } from "react";
import { useAssetPrefetch } from "../contexts/AssetPrefetchContext";

interface UsePrefetchOnHoverOptions {
  debounceMs?: number;
  enabled?: boolean;
}

interface UsePrefetchOnHoverResult {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Prefetch a project's videos once a hover outlasts the debounce, so a cursor
 * sweeping across the grid does not fire a request per card.
 */
export function usePrefetchOnHover(
  projectId: string,
  options: UsePrefetchOnHoverOptions = {},
): UsePrefetchOnHoverResult {
  const { debounceMs = 150, enabled = true } = options;
  const { prefetchProject } = useAssetPrefetch();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = useCallback(() => {
    if (!enabled) return;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced prefetch
    timeoutRef.current = setTimeout(() => {
      prefetchProject(projectId, "medium");
      timeoutRef.current = null;
    }, debounceMs);
  }, [projectId, prefetchProject, debounceMs, enabled]);

  const onMouseLeave = useCallback(() => {
    // Cancel pending prefetch if user leaves quickly
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  return {
    onMouseEnter,
    onMouseLeave,
  };
}
