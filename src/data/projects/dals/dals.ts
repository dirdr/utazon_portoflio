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
          src: "dals/carousel/pirate_compressed.mp4",
          title: "Pirate",
        },
        {
          src: "dals/carousel/jungeli_compressed.mp4",
          title: "Jungeli",
        },
        {
          src: "dals/carousel/bus_compressed.mp4",
          title: "Bus",
        },
        {
          src: "dals/carousel/miami_compressed.mp4",
          title: "Miami",
        },
        {
          src: "dals/carousel/lenie_compressed.mp4",
          title: "Lenie",
        },
        {
          src: "dals/carousel/boat_compressed.mp4",
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
          src: "dals/live/boat_live_compressed.mp4",
          title: "Boat Live",
        },
        {
          src: "dals/live/jungeli_live_compressed.mp4",
          title: "Jungeli Live",
        },
        {
          src: "dals/live/lenie_live_compressed.mp4",
          title: "Lenie Live",
        },
        {
          src: "dals/live/pirate_live.mp4",
          title: "Pirate Live",
        },
      ],
      copyright: {
        key: "copyright.videoCopyright",
      },
    },
  ],
};
