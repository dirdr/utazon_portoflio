import { Project } from "../../../types/project";

export const Vaziva: Project = {
  id: "vaziva",
  title: "projects.vaziva.title",
  date: "projects.vaziva.date",
  priority: 1,
  header: "projects.vaziva.header",
  description: "projects.vaziva.description",
  client: "projects.vaziva.client",
  role: "projects.vaziva.role",
  hasVideo: true,
  background: "/images/projects/vaziva/background.webp",
  showcases: [
    {
      type: "video-grid",
      id: "video-grid-1",
      order: 1,
      columns: 4,
      aspectRatio: "auto",
      videos: [
        { src: "vaziva/1.mp4" },
        { src: "vaziva/2.mp4" },
        { src: "vaziva/3.mp4" },
        { src: "vaziva/4.mp4" },
      ],
    },
    {
      type: "video-grid",
      id: "video-grid-2",
      order: 2,
      gridTemplate: "3fr 1.27fr",
      aspectRatio: "auto",
      videos: [
        { src: "vaziva/5.mp4", controls: true },
        { src: "vaziva/6.mp4" },
      ],
    },
  ],
};
