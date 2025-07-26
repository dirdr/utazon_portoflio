import { Project } from "../../../types/project";

export const ParisMusic2024: Project = {
  id: "paris-music-2024",
  title: "projects.paris-music-2024.title",
  date: "projects.paris-music-2024.date",
  priority: 7,
  header: "projects.paris-music-2024.header",
  description: "projects.paris-music-2024.description",
  client: "projects.paris-music-2024.client",
  role: "projects.paris-music-2024.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/paris-music-2024/details.webm`,
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
        src: "/images/projects/paris-music-2024/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/paris-music-2024/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/paris-music-2024/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
