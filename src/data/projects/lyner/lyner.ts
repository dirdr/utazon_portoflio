import { Project } from "../../../types/project";

export const Lyner: Project = {
  id: "lyner",
  title: "projects.lyner.title",
  date: "projects.lyner.date",
  priority: 3,
  header: "projects.lyner.header",
  description: "projects.lyner.description",
  client: "projects.lyner.client",
  role: "projects.lyner.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/lyner/details.webm`,
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
        src: "/images/projects/lyner/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/lyner/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/lyner/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
