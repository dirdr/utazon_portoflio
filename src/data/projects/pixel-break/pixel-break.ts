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
  hasVideo: true,
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "pixel-break/details.mp4",
        startTime: 1,
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 3,
      image: {
        src: "/images/projects/pixel-break/1.webp",
        alt: "Pixel Break 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 2,
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
