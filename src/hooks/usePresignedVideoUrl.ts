import { useState, useEffect, useRef } from "react";
import { apiClient } from "../services/api";
import { presignedUrlCache } from "../services/PresignedUrlCache";

interface UsePresignedVideoUrlResult {
  /** The resolved video URL (presigned, local, or external) */
  url: string | null;
  /** True while fetching presigned URL */
  loading: boolean;
  /** Error if presigned URL fetch failed */
  error: Error | null;
  /** Manually refresh the presigned URL */
  refresh: () => Promise<void>;
}

/**
 * Hook to manage presigned video URL lifecycle
 *
 * Handles three types of video sources:
 * - Local videos (starts with "/"): Returned as-is
 * - External URLs (starts with "http"): Returned as-is
 * - Backend videos (anything else): Fetches presigned URL from API
 *
 * Features:
 * - Automatic caching with expiration tracking
 * - Returns cached URL immediately if available
 * - Silent background fetching for better UX
 * - Clean error handling
 *
 * @param src - Video source path or URL
 * @returns Object with url, loading state, error state, and refresh function
 *
 * @example
 * ```tsx
 * const VideoPlayer = ({ src }) => {
 *   const { url, loading, error } = usePresignedVideoUrl(src);
 *
 *   if (loading) return <Skeleton />;
 *   if (error) return <ErrorMessage />;
 *   return <ReactPlayer url={url} />;
 * };
 * ```
 */
export function usePresignedVideoUrl(
  src: string | null | undefined,
): UsePresignedVideoUrlResult {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchPresignedUrl = async (objectKey: string) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const { url: presignedUrl, expires_in } =
        await apiClient.getPresignedVideoUrl(objectKey);

      if (!isMountedRef.current) return;

      // Cache the presigned URL
      presignedUrlCache.set(objectKey, presignedUrl, expires_in);
      setUrl(presignedUrl);
    } catch (err) {
      if (!isMountedRef.current) return;

      const error =
        err instanceof Error ? err : new Error("Failed to fetch presigned URL");
      setError(error);
      console.error(`Failed to fetch presigned URL for ${objectKey}:`, error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  const refresh = async () => {
    if (!src || src.startsWith("/") || src.startsWith("http")) {
      return;
    }
    await fetchPresignedUrl(src);
  };

  useEffect(() => {
    isMountedRef.current = true;

    // Reset state
    setUrl(null);
    setLoading(false);
    setError(null);

    if (!src) {
      return;
    }

    // Handle local videos (e.g., "/videos/intro/desktop/entry_desktop.mp4")
    if (src.startsWith("/")) {
      setUrl(src);
      return;
    }

    // Handle external URLs (e.g., "https://example.com/video.mp4")
    if (src.startsWith("http")) {
      setUrl(src);
      return;
    }

    // Handle backend videos - need presigned URL
    // Check cache first
    const cachedUrl = presignedUrlCache.get(src);
    if (cachedUrl) {
      setUrl(cachedUrl);
      return;
    }

    // Fetch presigned URL
    fetchPresignedUrl(src);

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [src]);

  return { url, loading, error, refresh };
}

/**
 * Utility function to prefetch presigned URLs for multiple videos
 * Useful for preloading videos before they're needed
 *
 * @param objectKeys - Array of R2 object keys to prefetch
 * @returns Promise that resolves when all URLs are fetched
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   prefetchPresignedUrls([
 *     "fooh/details.mp4",
 *     "dals/carousel/pirate.mp4"
 *   ]);
 * }, []);
 * ```
 */
export async function prefetchPresignedUrls(
  objectKeys: string[],
): Promise<void> {
  const fetchPromises = objectKeys.map(async (objectKey) => {
    try {
      // Skip if already cached
      if (presignedUrlCache.get(objectKey)) {
        return;
      }

      const { url, expires_in } =
        await apiClient.getPresignedVideoUrl(objectKey);
      presignedUrlCache.set(objectKey, url, expires_in);
    } catch (error) {
      console.error(
        `Failed to prefetch presigned URL for ${objectKey}:`,
        error,
      );
    }
  });

  await Promise.all(fetchPromises);
}
