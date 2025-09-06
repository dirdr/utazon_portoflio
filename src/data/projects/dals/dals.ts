import { Project } from "../../../types/project";

export const Dals: Project = {
  id: "dals",
  title: "projects.dals.title",
  date: "projects.dals.date",
  priority: 2,
  header: "projects.dals.header",
  description: "projects.dals.description",
  client: "projects.dals.client",
  role: "projects.dals.role",
  hasVideo: true,
  showcases: [
    {
      type: "video-carousel",
      id: "video-carousel-1",
      order: 2,
      videos: [
        {
          src: "/videos/projects/dals/pirate_compressed.mp4",
          title: "Pirate",
        },
        {
          src: "/videos/projects/dals/jungeli_compressed.mp4",
          title: "Jungeli",
        },
        {
          src: "/videos/projects/dals/bus_compressed.mp4",
          title: "Bus",
        },
        {
          src: "/videos/projects/dals/miami_compressed.mp4",
          title: "Miami",
        },
        {
          src: "/videos/projects/dals/lenie_compressed.mp4",
          title: "Lenie",
        },
        {
          src: "/videos/projects/dals/boat_compressed.mp4",
          title: "Boat",
        },
      ],
    },
    {
      type: "video-grid",
      id: "video-grid-1",
      order: 3,
      videos: [
        {
          src: "/videos/projects/dals/boat_live_compressed.mp4",
          title: "Boat Live",
        },
        {
          src: "/videos/projects/dals/jungeli_live_compressed.mp4",
          title: "Jungeli Live",
        },
        {
          src: "/videos/projects/dals/lenie_live_compressed.mp4",
          title: "Lenie Live",
        },
        {
          src: "/videos/projects/dals/pirate_live.mp4",
          title: "Pirate Live",
        },
      ],
      copyright: {
        key: "copyright.videoCopyright",
      },
    },
  ],
};
