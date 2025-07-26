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
        src: `/videos/projects/family-tech-drive/details.webm`,
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
        src: "/images/projects/family-tech-drive/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/family-tech-drive/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/family-tech-drive/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
