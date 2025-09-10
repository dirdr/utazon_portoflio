import { apiClient } from "../services/api";

export const getVideoUrl = (src: string): string => {
  if (src.startsWith('/')) return src;           // Local: "/videos/intro.mp4"
  if (src.startsWith('http')) return src;        // External: "https://..."
  return apiClient.getVideoUrl(src);             // Backend: "dals/live/video.mp4"
};