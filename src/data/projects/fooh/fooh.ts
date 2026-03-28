import { Project } from "../../../types/project";

export const Fooh: Project = {
  id: "fooh",
  title: "projects.fooh.title",
  date: "projects.fooh.date",
  priority: 15,
  header: "projects.fooh.header",
  description: "projects.fooh.description",
  client: "projects.fooh.client",
  role: "projects.fooh.role",
  hasVideo: true,
  background: "/images/projects/fooh/background.webp",
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      aspectRatio: "9/16",
      video: {
        src: "fooh/details1.mp4",
        light: "/images/projects/fooh/cover.webp",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 2,
      aspectRatio: "9/16",
      video: {
        src: "fooh/details2.mp4",
        light: "/images/projects/fooh/cover.webp",
      },
    },
  ],
};
