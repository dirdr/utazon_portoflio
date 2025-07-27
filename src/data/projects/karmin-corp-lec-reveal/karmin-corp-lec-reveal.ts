import { Project } from "../../../types/project";

export const KarminCorpLecReveal: Project = {
  id: "karmin-corp-lec-reveal",
  title: "projects.karmin-corp-lec-reveal.title",
  date: "projects.karmin-corp-lec-reveal.date",
  priority: 8,
  header: "projects.karmin-corp-lec-reveal.header",
  description: "projects.karmin-corp-lec-reveal.description",
  client: "projects.karmin-corp-lec-reveal.client",
  role: "projects.karmin-corp-lec-reveal.role",
  images: [],
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: `/videos/projects/karmin-corp-lec-reveal/details.webm`,
        light: "/images/projects/karmin-corp-lec-reveal/cover.webp",
      },
    },
    {
      type: "image-single",
      id: "image-1",
      order: 2,
      image: {
        src: "/images/projects/karmin-corp-lec-reveal/1.webp",
        alt: "Karmin Corp Lec Reveal 1",
      },
    },
    {
      type: "image-grid",
      id: "image-grid-1",
      order: 3,
      images: [
        {
          src: `/images/projects/karmin-corp-lec-reveal/2.webp`,
          alt: "Karmin Corp Lec Reveal 2",
        },
        {
          src: `/images/projects/karmin-corp-lec-reveal/3.webp`,
          alt: "Karmin Corp Lec Reveal 3",
        },
      ],
    },
  ],
};
