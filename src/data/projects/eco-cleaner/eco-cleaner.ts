import { Project } from "../../../types/project";

export const EcoCleaner: Project = {
  id: "eco-cleaner",
  title: "projects.eco-cleaner.title",
  date: "projects.eco-cleaner.date",
  priority: 14,
  header: "projects.eco-cleaner.header",
  description: "projects.eco-cleaner.description",
  client: "projects.eco-cleaner.client",
  role: "projects.eco-cleaner.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/eco-cleaner/details.webm`,
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
        src: "/images/projects/eco-cleaner/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/eco-cleaner/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/eco-cleaner/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
