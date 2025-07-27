import { Project } from "../../../types/project";

export const Yassencore: Project = {
  id: "yassencore",
  title: "projects.yassencore.title",
  date: "projects.yassencore.date",
  priority: 5,
  header: "projects.yassencore.header",
  description: "projects.yassencore.description",
  client: "projects.yassencore.client",
  role: "projects.yassencore.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/yassencore/details-1.webm`,
        light: "/images/projects/yassencore/3.webp",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 2,
      video: {
        src: `/videos/projects/yassencore/details-2.webm`,
        light: "/images/projects/yassencore/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 3,
      image: {
        src: "/images/projects/yassencore/1.webp",
        alt: "Yassencore 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 4,
      images: [
        {
          src: `/images/projects/yassencore/2.webp`,
          alt: "Yassencore 2",
        },
        {
          src: `/images/projects/yassencore/3.webp`,
          alt: "Yassencore 3",
        },
      ],
    },
  ],
};
