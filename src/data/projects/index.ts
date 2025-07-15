import { Project } from "../../types/project";

export const allProjects: Project[] = [];

export const getProjectById = (id: string): Project | undefined => {
  return allProjects.find((project) => project.id === id);
};
