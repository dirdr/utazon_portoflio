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
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "https://utazon-backend.adrienpelfresne.com/api/videos/fooh/details1.mp4",
        light: "/images/projects/fooh/cover.webp",
      },
    },
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "https://utazon-backend.adrienpelfresne.com/api/videos/fooh/details1.mp4",
        light: "/images/projects/fooh/cover.webp",
      },
    },
    {
      type: "image",
      id: "image-1",
      order: 2,
      mainImage: {
        src: "/images/projects/fooh/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/fooh/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/fooh/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
