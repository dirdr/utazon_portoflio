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
      type: "image-grid",
      id: "image-1",
      order: 1,
      images: [
        {
          src: "/images/projects/trybz/2.webp",
          alt: "Trybz 1",
        },
        {
          src: "/images/projects/trybz/3.webp",
          alt: "Trybz 2",
        },
        {
          src: "/images/projects/trybz/4.webp",
          alt: "Trybz 3",
        },
      ],
    },
  ],
};
