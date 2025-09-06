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
  hasVideo: true,
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "eco-cleaner/details.mp4",
        light: "/images/projects/eco-cleaner/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 3,
      image: {
        src: "/images/projects/eco-cleaner/1.webp",
        alt: "Eco Cleaner 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 2,
      images: [
        {
          src: `/images/projects/eco-cleaner/2.webp`,
          alt: "Eco Cleaner 2",
        },
        {
          src: `/images/projects/eco-cleaner/3.webp`,
          alt: "Eco Cleaner 3",
        },
      ],
    },
  ],
};
