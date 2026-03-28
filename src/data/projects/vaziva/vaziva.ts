import { Project } from "../../../types/project";

export const Vaziva: Project = {
  id: "vaziva",
  title: "projects.vaziva.title",
  date: "projects.vaziva.date",
  priority: 1,
  header: "projects.vaziva.header",
  description: "projects.vaziva.description",
  client: "projects.vaziva.client",
  role: "projects.vaziva.role",
  hasVideo: true,
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "vaziva/1.mp4",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 2,
      video: {
        src: "vaziva/2.mp4",
      },
    },
    {
      type: "video",
      id: "video-3",
      order: 3,
      video: {
        src: "vaziva/3.mp4",
      },
    },
    {
      type: "video",
      id: "video-4",
      order: 4,
      video: {
        src: "vaziva/4.mp4",
      },
    },
    {
      type: "video",
      id: "video-5",
      order: 5,
      video: {
        src: "vaziva/5.mp4",
      },
    },
    {
      type: "video",
      id: "video-6",
      order: 6,
      video: {
        src: "vaziva/6.mp4",
      },
    },
  ],
};
