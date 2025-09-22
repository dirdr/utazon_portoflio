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
  sm: "max-w-sm", // 24rem (384px)
  md: "max-w-md", // 28rem (448px)
  lg: "max-w-lg", // 32rem (512px)
  xl: "max-w-xl", // 36rem (576px)
  "2xl": "max-w-2xl", // 42rem (672px)
  "4xl": "max-w-4xl", // 56rem (896px)
  "5xl": "max-w-5xl", // 64rem (1024px)
  "6xl": "max-w-6xl", // 72rem (1152px)
  "7xl": "max-w-7xl", // 80rem (1280px)
  "8xl": "max-w-[1400px]", // Custom 1400px
  "screen-xl": "max-w-screen-xl", // 1280px (xl breakpoint)
  "screen-2xl": "max-w-screen-2xl", // 1536px (2xl breakpoint)
  "screen-3xl": "max-w-[1700px]", // Custom 1700px
  "screen-4xl": "max-w-[1920px]", // Custom 1920px (Full HD width)
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
