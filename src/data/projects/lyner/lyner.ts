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
  hasVideo: true,
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "lyner/details.mp4",
        startTime: 1,
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 2,
      images: [
        {
          src: `/images/projects/lyner/2.webp`,
          alt: "Lyner 2",
        },
        {
          src: `/images/projects/lyner/3.webp`,
          alt: "Lyner 3",
        },
      ],
    },
    {
      type: "image-single",
      id: "image-1",
      order: 3,
      image: {
        src: "/images/projects/lyner/1.webp",
        alt: "Lyner 1",
      },
    },
  ],
};
