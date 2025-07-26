import { Project } from "../../../types/project";

export const Trybz: Project = {
  id: "trybz",
  title: "projects.trybz.title",
  date: "projects.trybz.date",
  priority: 15,
  header: "projects.trybz.header",
  description: "projects.trybz.description",
  client: "projects.trybz.client",
  role: "projects.trybz.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/trybz/details.webm`,
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
        src: "/images/projects/trybz/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/trybz/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/trybz/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
