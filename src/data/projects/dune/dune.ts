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
        src: `/videos/projects/dune/details.webm`,
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
        src: "/images/projects/dune/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/dune/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/dune/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
