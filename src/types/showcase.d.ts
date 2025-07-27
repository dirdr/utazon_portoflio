export interface ShowcaseItem {
  type: "image" | "video" | "behind-the-scenes" | "carousel";
  id: string;
  order: number;
}

export interface SingleImageShowcaseData extends ShowcaseItem {
  type: "image-single";
  image: {
    src: string;
    alt: string;
    caption?: string;
  };
}

export interface GridImagesShowcaseData extends ShowcaseItem {
  type: "image-grid";
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export interface VideoShowcaseData extends ShowcaseItem {
  type: "video";
  video: {
    src: string;
    title?: string;
    light: string;
  };
}

export interface BehindTheScenesShowcaseData extends ShowcaseItem {
  type: "behind-the-scenes";
  title?: string;
  description?: string;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  layout?: "grid" | "masonry" | "stacked";
}

export interface CarouselShowcaseData extends ShowcaseItem {
  type: "carousel";
  title?: string;
  items: {
    type: "image" | "video";
    src: string;
    alt?: string;
    caption?: string;
    poster?: string;
  }[];
  autoPlay?: boolean;
  showThumbnails?: boolean;
}

export type ShowcaseData =
  | ImageShowcaseData
  | VideoShowcaseData
  | BehindTheScenesShowcaseData
  | CarouselShowcaseData;

export interface ProjectShowcaseConfig {
  projectId: string;
  showcases: ShowcaseData[];
}
