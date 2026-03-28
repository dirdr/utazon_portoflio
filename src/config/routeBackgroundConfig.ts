import backgroundImage from "../assets/images/background.webp";
import backgroundMobileImage from "../assets/images/background_mobile.png";
import { isMobile } from "../utils/mobileDetection";

export interface RouteBackgroundConfig {
  type: "image" | "none";
  desktop?: string;
  mobile?: string;
}

const ROUTE_BACKGROUNDS: Record<string, RouteBackgroundConfig> = {
  "/": { type: "none" },
  "/about": { type: "none" },
  "/projects": {
    type: "image",
    desktop: backgroundImage,
    mobile: backgroundMobileImage,
  },
  "/contact": {
    type: "image",
    desktop: backgroundImage,
    mobile: backgroundMobileImage,
  },
  "/showreel": {
    type: "image",
    desktop: backgroundImage,
    mobile: backgroundMobileImage,
  },
  "/legal": {
    type: "image",
    desktop: backgroundImage,
    mobile: backgroundMobileImage,
  },
};

/**
 * Get background configuration for a route
 * @param route - The route path (e.g., '/projects')
 * @returns Background image URL or empty string for no background
 */
export const getBackgroundForRoute = (route: string): string => {
  // Handle dynamic routes (e.g., /projects/some-project)
  const matchedRoute = findMatchingRoute(route);
  const config = ROUTE_BACKGROUNDS[matchedRoute];

  if (!config || config.type === "none") {
    return "";
  }

  if (config.type === "image") {
    return isMobile() ? config.mobile || "" : config.desktop || "";
  }

  return "";
};

/**
 * Find the best matching route configuration for a given path
 * Handles dynamic routes by finding the most specific match
 */
function findMatchingRoute(route: string): string {
  if (ROUTE_BACKGROUNDS[route]) {
    return route;
  }

  // Project detail pages (/projects/:id) have no background — they use inline hero backgrounds
  if (route.startsWith("/projects/")) {
    return "/";
  }

  return route;
}
