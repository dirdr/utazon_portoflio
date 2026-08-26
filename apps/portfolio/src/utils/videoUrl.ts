import { apiClient } from "../services/api";

export type VideoSourceType = "local" | "external" | "backend";

/**
 * @deprecated This function is deprecated for backend videos as they now require presigned URLs.
 * For backend videos, use the `usePresignedVideoUrl` hook instead.
 * This function still works for local and external URLs.
 *
 * @see usePresignedVideoUrl
 */
export const getVideoUrl = (src: string): string => {
  if (src.startsWith("/")) return src; // Local: "/videos/intro/desktop/entry_desktop.mp4"
  if (src.startsWith("http")) return src; // External: "https://..."
  return apiClient.getVideoUrl(src); // Backend: "dals/live/video.mp4" - DEPRECATED
};

/**
 * Identifies the type of video source
 *
 * @param src - Video source path or URL
 * @returns The type of video source: "local", "external", or "backend"
 *
 * @example
 * ```ts
 * getVideoSourceType("/videos/intro/desktop/entry_desktop.mp4") // "local"
 * getVideoSourceType("https://example.com/video.mp4") // "external"
 * getVideoSourceType("fooh/details.mp4") // "backend"
 * ```
 */
export function getVideoSourceType(src: string): VideoSourceType {
  if (src.startsWith("/")) return "local";
  if (src.startsWith("http")) return "external";
  return "backend";
}

/**
 * Checks if a video source requires a presigned URL
 *
 * @param src - Video source path or URL
 * @returns True if the source requires fetching a presigned URL
 */
export function requiresPresignedUrl(src: string): boolean {
  return getVideoSourceType(src) === "backend";
}
