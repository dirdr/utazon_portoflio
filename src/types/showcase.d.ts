export interface ShowcaseItem {
  type: "image-single" | "image-grid" | "video";
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
}

export type ShowcaseData =
  | SingleImageShowcaseData
  | GridImagesShowcaseData
  | VideoShowcaseData;
