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
        src: `/videos/projects/yassencore/details.webm`,
        title: "Project demonstration",
        autoPlay: true,
        loop: true,
        muted: true,
      },
    },
    {
      type: "image",
      id: "image-1",
      order: 2,
      mainImage: {
        src: "/images/projects/yassencore/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/yassencore/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/yassencore/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
