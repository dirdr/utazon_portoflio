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
        src: `/videos/projects/limova-movali/details.webm`,
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
        src: "/images/projects/limova-movali/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/limova-movali/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/limova-movali/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
