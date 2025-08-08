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
  showcases: [
    {
      type: "image-single",
      id: "image-1",
      order: 1,
      image: {
        src: "/images/projects/trybz/1.webp",
        alt: "Trybz 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 2,
      images: [
        {
          src: "/images/projects/trybz/2.webp",
          alt: "Trybz 2",
        },
        {
          src: "/images/projects/trybz/3.webp",
          alt: "Trybz 3",
        },
      ],
    },
    {
      type: "image-single",
      id: "image-2",
      order: 3,
      image: {
        src: "/images/projects/trybz/4.webp",
        alt: "Trybz 4",
      },
    },
  ],
};
