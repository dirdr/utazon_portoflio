import { Project } from "../../../types/project";

export const MrHelp: Project = {
  id: "mr-help",
  title: "projects.mr-help.title",
  date: "projects.mr-help.date",
  priority: 16,
  header: "projects.mr-help.header",
  description: "projects.mr-help.description",
  client: "projects.mr-help.client",
  agency: "projects.mr-help.agency",
  role: "projects.mr-help.role",
  hasVideo: true,
  background: "/images/projects/mr-help/background.webp",
  showcases: [
    {
      type: "video",
      id: "video-1",
      order: 1,
      video: {
        src: "mr-help/details1.mp4",
      },
    },
    {
      type: "video",
      id: "video-2",
      order: 2,
      video: {
        src: "mr-help/details2.mp4",
      },
    },
  ],
};
