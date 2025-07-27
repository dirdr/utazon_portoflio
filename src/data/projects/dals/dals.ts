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
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/dals/details.webm`,
        light: "/images/projects/dals/cover.webp",
      },
    },
    {
      type: "image",
      id: "image-1",
      order: 2,
      mainImage: {
        src: "/images/projects/dals/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/dals/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/dals/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
