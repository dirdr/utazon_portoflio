import { Project } from "../types/project";
import {
  ShowcaseData,
  VideoShowcaseData,
  VideoCarouselShowcaseData,
  VideoGridShowcaseData,
  MixedGrid2x2ShowcaseData,
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
    case "mixed-grid-2x2": {
      const mixedShowcase = showcase as MixedGrid2x2ShowcaseData;
      if (requiresPresignedUrl(mixedShowcase.video.src)) {
        keys.push(mixedShowcase.video.src);
      }
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
 * Extract all backend video keys from a list of showcases
 *
 * @param showcases - Showcases to scan
 * @returns Array of unique video keys that require presigned URLs
 */
export function extractShowcasesVideoKeys(showcases: ShowcaseData[]): string[] {
  const allKeys: string[] = [];

  showcases.forEach((showcase) => {
    allKeys.push(...extractShowcaseVideoKeys(showcase));
  });

  return Array.from(new Set(allKeys));
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

  return extractShowcasesVideoKeys(project.showcases);
}
