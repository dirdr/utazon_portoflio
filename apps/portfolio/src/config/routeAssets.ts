import { ROUTES } from "../constants/routes";
import { allProjectsSortedByPriority, getProjectById } from "../data/projects";
import backgroundImage from "../assets/images/background.webp";
import backgroundMobileImage from "../assets/images/background_mobile.png";
import { extractProjectVideoKeys } from "../utils/extractProjectVideoKeys";
import { extractProjectImages } from "../utils/extractProjectImages";

export interface RouteAssetConfig {
  images?: string[];
  videos?: string[];
  videoKeys?: string[]; // Backend video keys requiring presigned URLs
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
    // No videoKeys: the cards play local thumbnails. Showcase clips are
    // presigned per project by getDynamicRouteAssets when you open one.
    priority: "high",
  },

  [ROUTES.ABOUT]: {
    images: [backgroundImage, backgroundMobileImage],
    priority: "medium",
  },

  [ROUTES.LEGAL]: {
    images: [backgroundImage, backgroundMobileImage],
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
    const project = getProjectById(projectId);

    return {
      images: [
        ...(project?.background ? [project.background] : []),
        ...(project ? extractProjectImages(project) : []),
      ],
      videos: [],
      videoKeys: project ? extractProjectVideoKeys(project) : [],
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

  return config.images || [];
};

/**
 * How many images a route waits on before its transition completes. The rest
 * are fetched straight after, without gating the fade.
 */
const BLOCKING_IMAGE_COUNT = 4;

/** Images worth waiting for: roughly the first screenful. */
export const getRouteBlockingAssets = (
  route: string,
  params?: Record<string, string>,
): string[] => getRouteAssets(route, params).slice(0, BLOCKING_IMAGE_COUNT);

/** Everything below the fold, warmed in the background. */
export const getRouteDeferredAssets = (
  route: string,
  params?: Record<string, string>,
): string[] => getRouteAssets(route, params).slice(BLOCKING_IMAGE_COUNT);

/** Fire-and-forget warm-up; never awaited, never blocks a transition. */
export const warmImages = (urls: string[]): void => {
  urls.forEach((url) => {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  });
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

/**
 * Get video keys (backend videos requiring presigned URLs) for a given route
 */
export const getRouteVideoKeys = (
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

  return config.videoKeys || [];
};
