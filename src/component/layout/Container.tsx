import { cn } from "../../utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "fluid" | "constrained";
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "screen-xl"
    | "screen-2xl"
    | "screen-3xl"
    | "screen-4xl";
  as?: "div" | "main" | "section" | "article" | "header" | "footer";
}

const MAX_WIDTH_CLASSES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  "8xl": "max-w-[1400px]",
  "screen-xl": "max-w-screen-xl",
  "screen-2xl": "max-w-screen-2xl",
  "screen-3xl": "max-w-[1700px]",
  "screen-4xl": "max-w-[1920px]"
} as const;

export const Container = ({
  children,
  className,
  variant = "constrained",
  maxWidth,
  as = "div",
}: ContainerProps) => {
  const baseClasses = "w-full px-4 lg:px-12";

  const variantClasses =
    variant === "constrained" && maxWidth
      ? `${MAX_WIDTH_CLASSES[maxWidth]} mx-auto`
      : "";

  const Tag = as;

  return (
    <Tag className={cn(baseClasses, variantClasses, className)}>{children}</Tag>
  );
};
