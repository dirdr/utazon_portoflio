export interface CardProps {
  image: {
    src: string;
    alt: string;
  };
  project: {
    name: string;
    header: string;
    date: string;
  };
  className?: string;
  onClick?: () => void;
  glintSpeed?: string;
}