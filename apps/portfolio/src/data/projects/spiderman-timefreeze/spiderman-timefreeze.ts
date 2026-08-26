import { Project } from "../../../types/project";

export const SpidermanTimefreeze: Project = {
  id: "spiderman-timefreeze",
  title: "projects.spiderman-timefreeze.title",
  date: "projects.spiderman-timefreeze.date",
  priority: 7,
  header: "projects.spiderman-timefreeze.header",
  description: "projects.spiderman-timefreeze.description",
  client: "projects.spiderman-timefreeze.client",
  role: "projects.spiderman-timefreeze.role",
  hasVideo: true,
  images: [],
  background: "/images/projects/spiderman-timefreeze/background.webp",
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "spiderman-timefreeze/details.mp4",
        light: "/images/projects/spiderman-timefreeze/cover.webp",
      },
    },
  ],
};
