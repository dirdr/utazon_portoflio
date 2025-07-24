import { useState } from 'react';
import { cn } from '../../utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  placeholder?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  style,
  priority = false,
  placeholder = true,
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
      {placeholder && !isLoaded && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse",
            className
          )}
          style={style}
        />
      )}
      
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        style={style}
        loading={priority ? "eager" : "lazy"}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
      
      {hasError && (
        <div 
          className={cn(
            "absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm",
            className
          )}
          style={style}
        >
          Failed to load
        </div>
      )}
    </div>
  );
};