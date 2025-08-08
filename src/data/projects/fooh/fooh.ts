import { Project } from "../../../types/project";

export const Fooh: Project = {
  id: "fooh",
  title: "projects.fooh.title",
  date: "projects.fooh.date",
  priority: 12,
  header: "projects.fooh.header",
  description: "projects.fooh.description",
  client: "projects.fooh.client",
  role: "projects.fooh.role",
  hasVideo: true,
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "fooh/details1.mp4",
        light: "/images/projects/fooh/cover.webp",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 2,
      video: {
        src: "fooh/details2.mp4",
        light: "/images/projects/fooh/cover.webp",
      },
    },
  ],
};
