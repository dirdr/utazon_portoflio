import { useState } from "react";
import { cn } from "../../utils/cn";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className="relative overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300 gpu-accelerated",
          isLoaded ? "opacity-100" : "opacity-0",
          className,
        )}
        style={style}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        width={width}
        height={height}
        sizes={sizes}
      />

      {hasError && (
        <div
          className={cn(
            "absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm",
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

