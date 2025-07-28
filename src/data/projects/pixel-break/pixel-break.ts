import { Project } from "../../../types/project";

export const PixelBreak: Project = {
  id: "pixel-break",
  title: "projects.pixel-break.title",
  date: "projects.pixel-break.date",
  priority: 6,
  header: "projects.pixel-break.header",
  description: "projects.pixel-break.description",
  client: "projects.pixel-break.client",
  role: "projects.pixel-break.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "https://utazon-backend.adrienpelfresne.com/api/video/pixel-break/details.mp4",
        light: "/images/projects/pixel-break/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 2,
      image: {
        src: "/images/projects/pixel-break/1.webp",
        alt: "Pixel Break 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 3,
      images: [
        {
          src: `/images/projects/pixel-break/2.webp`,
          alt: "Pixel Break 2",
        },
        {
          src: `/images/projects/pixel-break/3.webp`,
          alt: "Pixel Break 3",
        },
      ],
    },
  ],
};
