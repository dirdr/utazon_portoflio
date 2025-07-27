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
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/limova-movali/details-1.webm`,
        light: "/images/projects/limova-movali/cover.webp",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 2,
      video: {
        src: `/videos/projects/limova-movali/details-2.webm`,
        autoPlay: true,
        loop: true,
        muted: true,
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
  ],
};
