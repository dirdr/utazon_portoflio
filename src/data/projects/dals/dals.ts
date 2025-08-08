import { Project } from "../../../types/project";

export const Dals: Project = {
  id: "dals",
  title: "projects.dals.title",
  date: "projects.dals.date",
  priority: 2,
  header: "projects.dals.header",
  description: "projects.dals.description",
  client: "projects.dals.client",
  role: "projects.dals.role",
  hasVideo: true,
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "dals/details.mp4",
        light: "/images/projects/dals/cover.webp",
      },
    },
    {
      type: "image-grid",
      id: "image-1",
      order: 2,
      images: [
        {
          src: "/images/projects/dals/1.webp",
          alt: "Dals 1",
        },
        {
          src: "/images/projects/dals/2.webp",
          alt: "Dals 2",
        },
        {
          src: "/images/projects/dals/3.webp",
          alt: "Dals 3",
        },
      ],
    },
  ],
};
