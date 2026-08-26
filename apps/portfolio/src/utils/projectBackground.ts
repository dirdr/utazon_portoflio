import { Project } from "../types/project";

/**
 * Get the background image path for a project.
 * Returns the explicitly defined background path or empty string if not defined.
 */
export const getProjectBackgroundPath = (project: Project): string => {
  return project.background || "";
};
