import { Project } from "../../../types/project";

export const NmaSnake: Project = {
  id: "nma-snake",
  title: "projects.nma-snake.title",
  date: "projects.nma-snake.date",
  priority: 2,
  header: "projects.nma-snake.header",
  description: "projects.nma-snake.description",
  client: "projects.nma-snake.client",
  role: "projects.nma-snake.role",
  hasVideo: true,
  background: "/images/projects/nma-snake/background.webp",
  showcases: [
    {
      type: "mixed-grid-2x2",
      id: "grid-1",
      order: 1,
      aspectRatio: "9/16",
      video: {
        src: "nma-snake/details.mp4",
        light: "/images/projects/nma-snake/cover.webp",
      },
      images: [
        {
          src: "/images/projects/nma-snake/1.webp",
          alt: "DJ Snake NMA 1",
        },
        {
          src: "/images/projects/nma-snake/2.webp",
          alt: "DJ Snake NMA 2",
        },
        {
          src: "/images/projects/nma-snake/3.webp",
          alt: "DJ Snake NMA 3",
        },
      ],
      copyright: {
        key: "copyright.videoCopyright",
      },
    },
  ],
};
