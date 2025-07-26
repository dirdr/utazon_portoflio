import { Project } from "../../../types/project";

export const AurumNova: Project = {
  id: "aurum-nova",
  title: "projects.aurum-nova.title",
  date: "projects.aurum-nova.date",
  priority: 1,
  header: "projects.aurum-nova.header",
  description: "projects.aurum-nova.description",
  client: "projects.aurum-nova.client",
  role: "projects.aurum-nova.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/aurum-nova/details.webm`,
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
        src: "/images/projects/aurum-nova/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/aurum-nova/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/aurum-nova/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
