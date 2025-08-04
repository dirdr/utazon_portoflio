import { Project } from "../../../types/project";

export const Dune: Project = {
  id: "dune",
  title: "projects.dune.title",
  date: "projects.dune.date",
  priority: 9,
  header: "projects.dune.header",
  description: "projects.dune.description",
  client: "projects.dune.client",
  role: "projects.dune.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "dune/details.mp4",
        light: "/images/projects/dune/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 2,
      image: {
        src: "/images/projects/dune/1.webp",
        alt: "Dune 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 3,
      images: [
        {
          src: `/images/projects/dune/2.webp`,
          alt: "Dune 2",
        },
        {
          src: `/images/projects/dune/3.webp`,
          alt: "Dune 3",
        },
      ],
    },
  ],
};
