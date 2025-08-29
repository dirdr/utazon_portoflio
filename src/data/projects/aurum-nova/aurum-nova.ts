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
  hasVideo: true,
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "aurum-nova/details.mp4",
        startTime: 1,
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 2,
      image: {
        src: "/images/projects/aurum-nova/1.webp",
        alt: "Aurum Nova 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 3,
      images: [
        {
          src: `/images/projects/aurum-nova/2.webp`,
          alt: "Aurum Nova 2",
        },
        {
          src: `/images/projects/aurum-nova/3.webp`,
          alt: "Aurum Nova 3",
        },
      ],
    },
  ],
};
