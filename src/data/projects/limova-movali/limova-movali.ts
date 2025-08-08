import { Project } from "../../../types/project";

export const LimovaMovali: Project = {
  id: "limova-movali",
  title: "projects.limova-movali.title",
  date: "projects.limova-movali.date",
  priority: 10,
  header: "projects.limova-movali.header",
  description: "projects.limova-movali.description",
  client: "projects.limova-movali.client",
  role: "projects.limova-movali.role",
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "limova-movali/details1.mp4",
        light: "/images/projects/limova-movali/cover.webp",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 2,
      video: {
        src: "limova-movali/details2.mp4",
        light: "/images/projects/limova-movali/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 3,
      image: {
        src: "/images/projects/limova-movali/1.webp",
        alt: "Limova Movali 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 4,
      images: [
        {
          src: `/images/projects/limova-movali/2.webp`,
          alt: "Limova Movali 2",
        },
        {
          src: `/images/projects/limova-movali/3.webp`,
          alt: "Limova Movali 3",
        },
      ],
    },
    {
      type: "image-single",
      id: "image-2",
      order: 5,
      image: {
        src: "/images/projects/limova-movali/4.webp",
        alt: "Limova Movali 4",
      },
    },
  ],
};
