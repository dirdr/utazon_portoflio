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
        src: "/images/projects/karmin-corp-lec-reveal/1.webp",
        alt: "Main project showcase",
      },
      bottomImages: [
        {
          src: `/images/projects/karmin-corp-lec-reveal/2.webp`,
          alt: "Project detail 1",
        },
        {
          src: `/images/projects/karmin-corp-lec-reveal/3.webp`,
          alt: "Project detail 2",
        },
      ],
    },
  ],
};
