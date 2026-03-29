import { Project } from "../../../types/project";

export const Domo: Project = {
  id: "domo",
  title: "projects.domo.title",
  date: "projects.domo.date",
  priority: 0,
  header: "projects.domo.header",
  description: "projects.domo.description",
  client: "projects.domo.client",
  agency: "projects.domo.agency",
  role: "projects.domo.role",
  hasVideo: true,
  background: "/images/projects/domo/background.webp",
  showcases: [
    {
      type: "video-grid",
      id: "video-grid-1",
      order: 1,
      columns: 3,
      videos: [
        { src: "domo/1.mp4", aspectRatio: "1/1" },
        { src: "domo/2.mp4", aspectRatio: "1/1" },
        { src: "domo/3.mp4", aspectRatio: "1/1" },
      ],
    },
    {
      type: "video-grid",
      id: "video-grid-2",
      order: 2,
      videos: [{ src: "domo/4.mp4" }],
    },
    {
      type: "video-carousel",
      id: "video-carousel-1",
      order: 3,
      videos: [
        { src: "domo/carrousel-1.mp4" },
        { src: "domo/carrousel-2.mp4" },
      ],
    },
  ],
};
