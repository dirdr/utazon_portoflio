import { ProjectShowcaseConfig } from "../types/showcase";

export const showcaseConfigs: Record<string, ProjectShowcaseConfig> = {
  // Example configuration - you can customize this for each project
  "example-project": {
    projectId: "example-project",
    showcases: [
      {
        type: "image",
        id: "image-1",
        order: 1,
        mainImage: {
          src: `/images/projects/example-project/main.webp`,
          alt: "Main project showcase",
          caption: "Main view of the project"
        },
        bottomImages: [
          {
            src: `/images/projects/example-project/detail-1.webp`,
            alt: "Project detail 1"
          },
          {
            src: `/images/projects/example-project/detail-2.webp`,
            alt: "Project detail 2"
          }
        ]
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
          muted: true
        }
      },
      {
        type: "behind-the-scenes",
        id: "bts-1",
        order: 3,
        title: "Behind the Scenes",
        description: "Development process and challenges",
        layout: "grid",
        images: [
          {
            src: `/images/projects/example-project/bts-1.webp`,
            alt: "Development process",
            caption: "Early wireframes"
          },
          {
            src: `/images/projects/example-project/bts-2.webp`,
            alt: "Design iterations"
          }
        ]
      },
      {
        type: "carousel",
        id: "carousel-1",
        order: 4,
        title: "Project Gallery",
        autoPlay: false,
        showThumbnails: true,
        items: [
          {
            type: "image",
            src: `/images/projects/example-project/gallery-1.webp`,
            alt: "Gallery image 1"
          },
          {
            type: "video",
            src: `/images/projects/example-project/gallery-video.mp4`,
            alt: "Gallery video",
            poster: `/images/projects/example-project/gallery-video-poster.webp`
          }
        ]
      }
    ]
  }
};

export const getShowcaseConfigForProject = (projectId: string): ProjectShowcaseConfig | null => {
  return showcaseConfigs[projectId] || null;
};