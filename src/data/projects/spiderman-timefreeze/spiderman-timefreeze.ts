import { Project } from "../../../types/project";

export const SpidermanTimefreeze: Project = {
  id: "spiderman-timefreeze",
  title: "projects.spiderman-timefreeze.title",
  date: "projects.spiderman-timefreeze.date",
  priority: 4,
  header: "projects.spiderman-timefreeze.header",
  description: "projects.spiderman-timefreeze.description",
  client: "projects.spiderman-timefreeze.client",
  role: "projects.spiderman-timefreeze.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/spiderman-timefreeze/details.webm`,
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
        src: "/images/projects/spiderman-timefreeze/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/spiderman-timefreeze/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/spiderman-timefreeze/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
