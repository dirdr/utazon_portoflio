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
        src: `/videos/projects/pixel-break/details.webm`,
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
        src: "/images/projects/pixel-break/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/pixel-break/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/pixel-break/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
