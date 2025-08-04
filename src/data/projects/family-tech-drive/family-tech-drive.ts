import { Project } from "../../../types/project";

export const FamilyTechDrive: Project = {
  id: "family-tech-drive",
  title: "projects.family-tech-drive.title",
  date: "projects.family-tech-drive.date",
  priority: 11,
  header: "projects.family-tech-drive.header",
  description: "projects.family-tech-drive.description",
  client: "projects.family-tech-drive.client",
  role: "projects.family-tech-drive.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "family-tech-drive/details.mp4",
        light: "/images/projects/family-tech-drive/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 2,
      image: {
        src: "/images/projects/family-tech-drive/1.webp",
        alt: "Family Tech Drive 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 3,
      images: [
        {
          src: `/images/projects/family-tech-drive/2.webp`,
          alt: "Family Tech Drive 2",
        },
        {
          src: `/images/projects/family-tech-drive/3.webp`,
          alt: "Family Tech Drive 3",
        },
      ],
    },
  ],
};
