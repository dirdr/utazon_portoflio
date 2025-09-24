import { ROUTES } from "../constants/routes";
import { allProjectsSortedByPriority } from "../data/projects";
import backgroundImage from "../assets/images/background.webp";
import backgroundMobileImage from "../assets/images/background_mobile.png";

export interface RouteAssetConfig {
  images?: string[];
  videos?: string[];
  fonts?: string[];
  priority?: "low" | "medium" | "high";
}

/**
 * Global declaration of route-specific assets for preloading
 * Centralized, modular, and easy to maintain
 */
export const ROUTE_ASSETS: Record<string, RouteAssetConfig> = {
  [ROUTES.HOME]: {
    images: [],
    priority: "high",
  },

  [ROUTES.PROJECTS]: {
    images: [
      backgroundImage,
      backgroundMobileImage,
      ...allProjectsSortedByPriority.map(
        (project) => `/images/projects/${project.id}/cover.webp`,
      ),
      ...allProjectsSortedByPriority.map(
        (project) => `/images/projects/${project.id}/background.webp`,
      ),
    ],
    videos: [
      ...allProjectsSortedByPriority
        .filter((project) => project.hasVideo !== false)
        .map((project) => `/videos/projects/${project.id}/thumbnail.webm`),
    ],
    priority: "high",
  },

  [ROUTES.ABOUT]: {
    images: [
      backgroundImage,
      backgroundMobileImage,
    ],
    priority: "medium",
  },

  [ROUTES.LEGAL]: {
    images: [
      backgroundImage,
      backgroundMobileImage,
    ],
    priority: "low",
  },
};

/**
 * Dynamic route patterns (e.g., /projects/:id)
 * Returns assets based on route parameters
 */
export const getDynamicRouteAssets = (
  route: string,
  params: Record<string, string>,
): RouteAssetConfig => {
  if (route.startsWith("/projects/") && params.id) {
    const projectId = params.id;
    return {
      images: [
        `/images/projects/${projectId}/background.webp`,
      ],
      videos: [],
      priority: "high",
    };
  }

  return { images: [], priority: "low" };
};

/**
 * Get all assets for a given route
 */
export const getRouteAssets = (
  route: string,
  params?: Record<string, string>,
): string[] => {
  let config: RouteAssetConfig;

  if (params && Object.keys(params).length > 0) {
    config = getDynamicRouteAssets(route, params);
  } else if (route.startsWith("/projects/")) {
    const projectId = route.split("/projects/")[1];
    config = getDynamicRouteAssets(route, { id: projectId });
  } else {
    config = ROUTE_ASSETS[route] || { images: [] };
  }

  return [
    ...(config.images || []),
    ...(config.videos || []),
    ...(config.fonts || []),
  ];
};

/**
 * Check if a route requires cache verification
 */
export const shouldPreloadRoute = (route: string): boolean => {
  const config = ROUTE_ASSETS[route];

  if (route.startsWith("/projects/")) {
    return true;
  }

  return config?.priority === "high" || config?.priority === "medium";
};

