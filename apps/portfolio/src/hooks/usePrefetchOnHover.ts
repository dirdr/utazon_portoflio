import { useCallback, useRef } from "react";
import { useAssetPrefetch } from "../contexts/AssetPrefetchContext";

interface UsePrefetchOnHoverOptions {
  /**
   * Debounce delay in milliseconds
   * @default 150
   */
  debounceMs?: number;

  /**
   * Whether to enable prefetching
   * @default true
   */
  enabled?: boolean;
}

interface UsePrefetchOnHoverResult {
  /**
   * Call on mouse enter
   */
  onMouseEnter: () => void;

  /**
   * Call on mouse leave
   */
  onMouseLeave: () => void;
}

/**
 * Hook for debounced hover-based prefetching
 *
 * Prefetches project videos after 150ms hover delay
 * Cancels prefetch if user leaves before delay completes
 *
 * @param projectId - ID of project to prefetch
 * @param options - Configuration options
 * @returns Mouse event handlers
 *
 * @example
 * ```tsx
 * const Card = ({ projectId }) => {
 *   const { onMouseEnter, onMouseLeave } = usePrefetchOnHover(projectId);
 *
 *   return (
 *     <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
 *       {/* Card content *\/}
 *     </div>
 *   );
 * };
 * ```
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
