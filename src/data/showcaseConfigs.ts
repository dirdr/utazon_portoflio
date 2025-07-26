import { ProjectShowcaseConfig } from "../types/showcase";

export const showcaseConfigs: Record<string, ProjectShowcaseConfig> = {
  "aurum-nova": {
    projectId: "example-project",
    showcases: [
      {
        type: "image",
        id: "image-1",
        order: 1,
        mainImage: {
          src: "/images/projects/aurum-nova/1.webp",
          alt: "Main project showcase",
        },
        bottomImages: [
          {
            src: `/images/projects/aurum-nova/2.webp`,
            alt: "Project detail 1",
          },
          {
            src: `/images/projects/aurum-nova/3.webp`,
            alt: "Project detail 2",
          },
        ],
      },
      {
        type: "video",
        id: "video-1",
        order: 2,
        video: {
          src: `/images/projects/example-project/demo.mp4`,
          title: "Project demonstration",
          autoPlay: true,
          loop: true,
          muted: true,
        },
      },
    ],
  },
};

export const getShowcaseConfigForProject = (
  projectId: string,
): ProjectShowcaseConfig | null => {
  return showcaseConfigs[projectId] || null;
};

