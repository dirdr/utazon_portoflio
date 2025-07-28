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
        src: "https://utazon-backend.adrienpelfresne.com/api/video/paris-music-2024/details.mp4",
        light: "/images/projects/paris-music-2024/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 2,
      image: {
        src: "/images/projects/paris-music-2024/1.webp",
        alt: "Paris Music 2024 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 3,
      images: [
        {
          src: `/images/projects/paris-music-2024/2.webp`,
          alt: "Paris Music 2024 2",
        },
        {
          src: `/images/projects/paris-music-2024/3.webp`,
          alt: "Paris Music 2024 3",
        },
      ],
    },
  ],
};
