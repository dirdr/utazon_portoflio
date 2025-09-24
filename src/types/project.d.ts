import { ShowcaseData } from "./showcase";

export interface Project {
  id: string;
  title: string;
  date: string;
  priority: number;
  header: string;
  description: string;
  client: string;
  role: string;
  hasVideo?: boolean;
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  links?: {
    live?: string;
  };
  showcases?: ShowcaseData[];
}
