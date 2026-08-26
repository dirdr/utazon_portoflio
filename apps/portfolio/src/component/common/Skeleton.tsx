import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Loading placeholder. Decorative only: the surrounding region should carry
 * aria-busy so screen readers hear "loading" rather than an empty box.
 */
export const Skeleton = ({ className, style }: SkeletonProps) => (
  <div className={cn("skeleton", className)} style={style} aria-hidden="true" />
);
