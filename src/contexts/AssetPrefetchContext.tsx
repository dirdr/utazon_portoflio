import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { prefetchPresignedUrls } from "../hooks/usePresignedVideoUrl";
import { presignedUrlCache } from "../services/PresignedUrlCache";
import { getProjectById } from "../data/projects";
import { extractProjectVideoKeys } from "../utils/extractProjectVideoKeys";

/**
 * Priority levels for prefetch requests
 * - high: Critical resources (current route)
 * - medium: Likely next resources (hover)
 * - low: Background prefetching
 */
export type PrefetchPriority = "high" | "medium" | "low";

interface AssetPrefetchContextType {
  /**
   * Prefetch presigned URLs for multiple video keys
   * @param keys - Array of R2 object keys
   * @param priority - Priority level (high/medium/low)
   * @returns Promise that resolves when all URLs are fetched or cached
   */
  prefetchVideos: (
    keys: string[],
    priority?: PrefetchPriority,
  ) => Promise<void>;

  /**
   * Check if a video URL is already cached
   * @param key - R2 object key
   * @returns true if cached and not expired
   */
  isVideoCached: (key: string) => boolean;

  /**
   * Prefetch all videos for a specific project
   * @param projectId - Project ID
   * @param priority - Priority level
   * @returns Promise that resolves when all project videos are fetched
   */
  prefetchProject: (
    projectId: string,
    priority?: PrefetchPriority,
  ) => Promise<void>;

  /**
   * Get statistics about in-flight and cached requests
   */
  getStats: () => {
    inFlight: number;
    cached: number;
  };
}

const AssetPrefetchContext = createContext<
  AssetPrefetchContextType | undefined
>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAssetPrefetch = () => {
  const context = useContext(AssetPrefetchContext);
  if (!context) {
    throw new Error(
      "useAssetPrefetch must be used within AssetPrefetchProvider",
    );
  }
  return context;
};

interface AssetPrefetchProviderProps {
  children: ReactNode;
}

export const AssetPrefetchProvider: React.FC<AssetPrefetchProviderProps> = ({
  children,
}) => {
  // Track in-flight requests to prevent duplicates
  const inFlightRequests = useRef<Set<string>>(new Set());

  // Track pending promises for request deduplication
  const pendingPromises = useRef<Map<string, Promise<void>>>(new Map());

  /**
   * Check if a video is already cached
   */
  const isVideoCached = useCallback((key: string): boolean => {
    const cached = presignedUrlCache.get(key);
    return cached !== null;
  }, []);

  /**
   * Prefetch videos with request deduplication
   */
  const prefetchVideos = useCallback(
    async (keys: string[], priority: PrefetchPriority = "medium") => {
      if (keys.length === 0) return;

      // Filter out already cached videos
      const uncachedKeys = keys.filter((key) => !isVideoCached(key));

      if (uncachedKeys.length === 0) {
        return;
      }

      // Further filter to only keys not currently in-flight
      const keysToFetch = uncachedKeys.filter(
        (key) => !inFlightRequests.current.has(key),
      );

      if (keysToFetch.length === 0) {
        // All keys are either cached or in-flight
        // Wait for in-flight requests to complete
        const waitPromises = uncachedKeys
          .map((key) => pendingPromises.current.get(key))
          .filter((p): p is Promise<void> => p !== undefined);

        await Promise.allSettled(waitPromises);
        return;
      }

      // Mark keys as in-flight
      keysToFetch.forEach((key) => inFlightRequests.current.add(key));

      try {
        // Create a single promise for this batch
        const batchPromise = prefetchPresignedUrls(keysToFetch);

        // Store individual promises for deduplication
        keysToFetch.forEach((key) => {
          pendingPromises.current.set(key, batchPromise);
        });

        await batchPromise;
      } catch (error) {
        console.error(
          `[AssetPrefetch] Failed to prefetch videos (priority: ${priority}):`,
          error,
        );
      } finally {
        // Remove from in-flight tracking
        keysToFetch.forEach((key) => {
          inFlightRequests.current.delete(key);
          pendingPromises.current.delete(key);
        });
      }
    },
    [isVideoCached],
  );

  /**
   * Prefetch all videos for a specific project
   */
  const prefetchProject = useCallback(
    async (projectId: string, priority: PrefetchPriority = "medium") => {
      const project = getProjectById(projectId);
      if (!project) {
        console.warn(`[AssetPrefetch] Project not found: ${projectId}`);
        return;
      }

      const videoKeys = extractProjectVideoKeys(project);
      await prefetchVideos(videoKeys, priority);
    },
    [prefetchVideos],
  );

  /**
   * Get statistics
   */
  const getStats = useCallback(() => {
    const cacheStats = presignedUrlCache.getStats();
    return {
      inFlight: inFlightRequests.current.size,
      cached: cacheStats.size,
    };
  }, []);

  const value: AssetPrefetchContextType = {
    prefetchVideos,
    isVideoCached,
    prefetchProject,
    getStats,
  };

  return (
    <AssetPrefetchContext.Provider value={value}>
      {children}
    </AssetPrefetchContext.Provider>
  );
};
