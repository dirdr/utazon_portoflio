import { ProjectDetail } from "../../types/project";
import { exampleProject } from "./example-project";
import { motionReel } from "./motion-reel";
import { brandIdentity } from "./brand-identity";

export const allProjects: ProjectDetail[] = [
  exampleProject,
  motionReel,
  brandIdentity,
];

export const getProjectById = (id: string): ProjectDetail | undefined => {
  return allProjects.find(project => project.id === id);
};

export const getFeaturedProjects = (): ProjectDetail[] => {
  return allProjects.filter(project => project.featured);
};