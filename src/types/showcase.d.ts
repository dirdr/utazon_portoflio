export interface ShowcaseItem {
  type: 'image' | 'video' | 'behind-the-scenes' | 'carousel';
  id: string;
  order: number;
}

export interface ImageShowcaseData extends ShowcaseItem {
  type: 'image';
  mainImage: {
    src: string;
    alt: string;
    caption?: string;
  };
  bottomImages: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export interface VideoShowcaseData extends ShowcaseItem {
  type: 'video';
  video: {
    src: string;
    title?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    poster?: string;
  };
}

export interface BehindTheScenesShowcaseData extends ShowcaseItem {
  type: 'behind-the-scenes';
  title?: string;
  description?: string;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  layout?: 'grid' | 'masonry' | 'stacked';
}

export interface CarouselShowcaseData extends ShowcaseItem {
  type: 'carousel';
  title?: string;
  items: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
    caption?: string;
    poster?: string; // For videos
  }[];
  autoPlay?: boolean;
  showThumbnails?: boolean;
}

export type ShowcaseData = ImageShowcaseData | VideoShowcaseData | BehindTheScenesShowcaseData | CarouselShowcaseData;

export interface ProjectShowcaseConfig {
  projectId: string;
  showcases: ShowcaseData[];
}