export interface ShowcaseItem {
  type:
    | "image-single"
    | "image-grid"
    | "video"
    | "video-carousel"
    | "video-grid"
    | "mixed-grid-2x2";
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
    light?: string | null;
    startTime?: number;
  };
  aspectRatio?: string;
}

export interface VideoCarouselShowcaseData extends ShowcaseItem {
  type: "video-carousel";
  videos: {
    src: string;
    title?: string;
  }[];
}

export interface VideoGridShowcaseData extends ShowcaseItem {
  type: "video-grid";
  videos: {
    src: string;
    title?: string;
    light?: string | null;
    startTime?: number;
    span?: number;
    aspectRatio?: string;
  }[];
  columns?: 2 | 3 | 4;
  aspectRatio?: string;
  copyright?: {
    key: string;
  };
}

export interface MixedGrid2x2ShowcaseData extends ShowcaseItem {
  type: "mixed-grid-2x2";
  video: {
    src: string;
    title?: string;
    light?: string | null;
    startTime?: number;
  };
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  copyright?: {
    key: string;
  };
  aspectRatio?: string;
}

export type ShowcaseData =
  | SingleImageShowcaseData
  | GridImagesShowcaseData
  | VideoShowcaseData
  | VideoCarouselShowcaseData
  | VideoGridShowcaseData
  | MixedGrid2x2ShowcaseData;
