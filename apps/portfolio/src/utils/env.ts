import { config } from "../config/environment";

/**
 * Get base URL (runtime)
 */
export const getBaseUrl = (): string => {
  return config.siteUrl;
};

/**
 * Get canonical URL for a path
 */
export const getCanonicalUrl = (path: string = ""): string => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return cleanPath ? `${config.siteUrl}/${cleanPath}` : config.siteUrl;
};

/**
 * Get Open Graph image URL
 */
export const getOgImageUrl = (
  imagePath: string = "images/og-image.png",
): string => {
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${config.siteUrl}/${cleanPath}`;
};
