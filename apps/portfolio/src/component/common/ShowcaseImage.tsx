import { cn } from "../../utils/cn";
import { useImageLoaded } from "../../hooks/useImageLoaded";
import { Skeleton } from "./Skeleton";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
}

export const ShowcaseImage = ({
  src,
  alt,
  className,
  style,
  priority = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: OptimizedImageProps) => {
  const { loaded, error, onLoad, onError } = useImageLoaded(src);

  // The wrapper takes its height from the image, and an <img> with no width or
  // height attribute has none until it decodes. Without a reservation the box
  // is zero-high, so the placeholder inside it has nothing to fill. Exact
  // dimensions win when the caller knows them; otherwise hold a 16/9 box until
  // the real image can size the wrapper itself.
  const knownRatio = width && height ? `${width} / ${height}` : undefined;
  const reservedRatio = knownRatio ?? (loaded ? undefined : "16 / 9");

  return (
    <div
      className="relative overflow-hidden"
      style={reservedRatio ? { aspectRatio: reservedRatio } : undefined}
      aria-busy={!loaded}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "gpu-accelerated transition-opacity duration-300",
          knownRatio && "w-full h-full",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
        style={style}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={onLoad}
        onError={onError}
        decoding="async"
        width={width}
        height={height}
        sizes={sizes}
      />

      {!loaded && (
        <Skeleton className={cn(className, "absolute inset-0")} style={style} />
      )}

      {error && (
        <div
          className={cn(
            "absolute inset-0 bg-background flex items-center justify-center text-muted text-sm",
            className,
          )}
          style={style}
        >
          Failed to load
        </div>
      )}
    </div>
  );
};
