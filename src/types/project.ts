export interface ProjectMeta {
  id: string;
  title: string;
  description: string;
  cover: string;
  featured: boolean;
}

export interface ProjectDetail extends ProjectMeta {
  longDescription: string;
  technologies: string[];
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  links?: {
    live?: string;
  };
  credits?: {
    role: string;
    name: string;
  }[];
}