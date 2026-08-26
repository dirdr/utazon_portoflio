import { Project } from "../types/project";
import {
  ShowcaseData,
  VideoShowcaseData,
  VideoCarouselShowcaseData,
  VideoGridShowcaseData,
} from "../types/showcase";
import { requiresPresignedUrl } from "./videoUrl";

/**
 * Extract video keys from a single showcase item
 */
function extractShowcaseVideoKeys(showcase: ShowcaseData): string[] {
  const keys: string[] = [];

  switch (showcase.type) {
    case "video": {
      const videoShowcase = showcase as VideoShowcaseData;
      if (requiresPresignedUrl(videoShowcase.video.src)) {
        keys.push(videoShowcase.video.src);
      }
      break;
    }
    case "video-carousel": {
      const carouselShowcase = showcase as VideoCarouselShowcaseData;
      carouselShowcase.videos.forEach((video) => {
        if (requiresPresignedUrl(video.src)) {
          keys.push(video.src);
        }
      });
      break;
    }
    case "video-grid": {
      const gridShowcase = showcase as VideoGridShowcaseData;
      gridShowcase.videos.forEach((video) => {
        if (requiresPresignedUrl(video.src)) {
          keys.push(video.src);
        }
      });
      break;
    }
    // Image types don't have videos
    case "image-single":
    case "image-grid":
      break;
  }

  return keys;
}

/**
 * Extract all backend video keys from a project
 *
 * Filters only videos that require presigned URLs (backend videos)
 * Excludes local videos (starting with "/") and external URLs (starting with "http")
 *
 * @param project - Project object with showcases
 * @returns Array of unique video keys that require presigned URLs
 *
 * @example
 * ```ts
 * const project = getProjectById("fooh");
 * const keys = extractProjectVideoKeys(project);
 * // ["fooh/details1.mp4", "fooh/details2.mp4"]
 * ```
 */
export function extractProjectVideoKeys(project: Project): string[] {
  if (!project.showcases || project.showcases.length === 0) {
    return [];
  }

  const allKeys: string[] = [];

  project.showcases.forEach((showcase) => {
    const keys = extractShowcaseVideoKeys(showcase);
    allKeys.push(...keys);
  });

  // Remove duplicates
  return Array.from(new Set(allKeys));
}

/**
 * Extract all backend video keys from multiple projects
 *
 * @param projects - Array of projects
 * @returns Array of unique video keys from all projects
 *
 * @example
 * ```ts
 * const keys = extractAllProjectsVideoKeys(allProjectsSortedByPriority);
 * // All backend video keys from all projects
 * ```
 */
export function extractAllProjectsVideoKeys(projects: Project[]): string[] {
  const allKeys: string[] = [];

  projects.forEach((project) => {
    const keys = extractProjectVideoKeys(project);
    allKeys.push(...keys);
  });

  // Remove duplicates
  return Array.from(new Set(allKeys));
}
