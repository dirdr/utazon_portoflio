export interface Project {
  id: string;
  title: string;
  cover: string;
  date: string;
  priority: number;
  header: string;
  description: string;
  client: string;
  role: string;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  links?: {
    live?: string;
  };
}
