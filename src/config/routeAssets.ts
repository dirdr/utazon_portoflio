import { ROUTES } from "../constants/routes";
import { allProjectsSortedByPriority } from "../data/projects";

export interface RouteAssetConfig {
  images?: string[];
  videos?: string[];
  fonts?: string[];
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Global declaration of route-specific assets for preloading
 * Centralized, modular, and easy to maintain
 */
export const ROUTE_ASSETS: Record<string, RouteAssetConfig> = {
  [ROUTES.HOME]: {
    images: [
      // Already handled by global loader
    ],
    priority: 'high',
  },

  [ROUTES.PROJECTS]: {
    images: [
      // All project cover images
      ...allProjectsSortedByPriority.map(project => 
        `/images/projects/${project.id}/cover.webp`
      ),
      // All project background images
      ...allProjectsSortedByPriority.map(project => 
        `/images/projects/${project.id}/background.webp`
      ),
    ],
    videos: [
      // Project thumbnails (optional)
      ...allProjectsSortedByPriority
        .filter(project => project.hasVideo !== false)
        .map(project => `/videos/projects/${project.id}/thumbnail.webm`),
    ],
    priority: 'high',
  },

  [ROUTES.ABOUT]: {
    images: [
      // Add about page specific images here when you have them
      // '/images/about/profile.webp',
      // '/images/about/skills.webp',
    ],
    priority: 'medium',
  },

  [ROUTES.CONTACT]: {
    images: [
      // Contact page assets
    ],
    priority: 'low',
  },

  [ROUTES.LEGAL]: {
    images: [],
    priority: 'low',
  },
};

/**
 * Dynamic route patterns (e.g., /projects/:id)
 * Returns assets based on route parameters
 */
export const getDynamicRouteAssets = (route: string, params: Record<string, string>): RouteAssetConfig => {
  // Project detail pages
  if (route.startsWith('/projects/') && params.id) {
    const projectId = params.id;
    return {
      images: [
        // Only the background image is actually used in ProjectHeroSection
        `/images/projects/${projectId}/background.webp`,
      ],
      videos: [],
      priority: 'high',
    };
  }

  return { images: [], priority: 'low' };
};

/**
 * Get all assets for a given route
 */
export const getRouteAssets = (route: string, params?: Record<string, string>): string[] => {
  let config: RouteAssetConfig;

  // Check for dynamic routes first
  if (params && Object.keys(params).length > 0) {
    config = getDynamicRouteAssets(route, params);
  } else if (route.startsWith('/projects/')) {
    // Handle project detail routes without explicit params
    const projectId = route.split('/projects/')[1];
    config = getDynamicRouteAssets(route, { id: projectId });
  } else {
    // Static routes
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
  
  // Project detail routes should preload
  if (route.startsWith('/projects/')) {
    return true;
  }
  
  return config?.priority === 'high' || config?.priority === 'medium';
};