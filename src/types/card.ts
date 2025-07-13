export interface CardProps {
  image: {
    src: string;
    alt: string;
  };
  project: {
    name: string;
    description: string;
  };
  className?: string;
  onClick?: () => void;
}