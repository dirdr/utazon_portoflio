import { Project } from "../../../types/project";

export const NmaKatseye: Project = {
  id: "nma-katseye",
  title: "projects.nma-katseye.title",
  date: "projects.nma-katseye.date",
  priority: 3,
  header: "projects.nma-katseye.header",
  description: "projects.nma-katseye.description",
  client: "projects.nma-katseye.client",
  role: "projects.nma-katseye.role",
  hasVideo: true,
  background: "/images/projects/nma-katseye/background.webp",
  showcases: [
    {
      type: "mixed-grid-2x2",
      id: "grid-1",
      order: 1,
      aspectRatio: "9/16",
      video: {
        src: "nma-katseye/details.mp4",
        light: "/images/projects/nma-katseye/cover.webp",
      },
      images: [
        {
          src: "/images/projects/nma-katseye/1.webp",
          alt: "KATSEYE NMA 1",
        },
        {
          src: "/images/projects/nma-katseye/2.webp",
          alt: "KATSEYE NMA 2",
        },
        {
          src: "/images/projects/nma-katseye/3.webp",
          alt: "KATSEYE NMA 3",
        },
      ],
      copyright: {
        key: "copyright.videoCopyright",
      },
    },
  ],
};
