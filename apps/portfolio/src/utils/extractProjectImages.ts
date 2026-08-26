import { Project } from "../types/project";
import {
  ShowcaseData,
  SingleImageShowcaseData,
  GridImagesShowcaseData,
  MixedGrid2x2ShowcaseData,
} from "../types/showcase";

function extractShowcaseImageSrcs(showcase: ShowcaseData): string[] {
  switch (showcase.type) {
    case "image-single":
      return [(showcase as SingleImageShowcaseData).image.src];

    case "image-grid":
      return (showcase as GridImagesShowcaseData).images.map((i) => i.src);

    case "mixed-grid-2x2":
      return (showcase as MixedGrid2x2ShowcaseData).images.map((i) => i.src);

    default:
      return [];
  }
}

/**
 * Every image a project page will render, in display order.
 *
 * These were absent from the route asset list entirely, so they only ever
 * loaded lazily once scrolled to, which a fast flick outruns.
 */
export function extractProjectImages(project: Project): string[] {
  if (!project.showcases?.length) {
    return [];
  }

  const ordered = [...project.showcases].sort((a, b) => a.order - b.order);
  const srcs = ordered.flatMap(extractShowcaseImageSrcs);

  return Array.from(new Set(srcs));
}
