import { Project } from "../../../types/project";

export const MrHelp: Project = {
  id: "mr-help",
  title: "projects.mr-help.title",
  date: "projects.mr-help.date",
  priority: 13,
  header: "projects.mr-help.header",
  description: "projects.mr-help.description",
  client: "projects.mr-help.client",
  role: "projects.mr-help.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-2",
      order: 1,
      video: {
        src: "https://utazon-backend.adrienpelfresne.com/api/video/mr-help/details1.mp4",
        light: "/images/projects/mr-help/cover.webp",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 1,
      video: {
        src: "https://utazon-backend.adrienpelfresne.com/api/video/mr-help/details2.mp4",
        light: "/images/projects/mr-help/cover.webp",
      },
    },

    {
      type: "image",
      id: "image-1",
      order: 2,
      mainImage: {
        src: "/images/projects/mr-help/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/mr-help/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/mr-help/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
