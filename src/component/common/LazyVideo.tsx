import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyVideoProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onLoadedData?: () => void;
  onError?: () => void;
}

export interface LazyVideoRef {
  play: () => void;
  pause: () => void;
}

export const LazyVideo = forwardRef<LazyVideoRef, LazyVideoProps>(({
  src,
  alt,
  className,
  style,
  onLoadedData,
  onError,
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px',
  });

  // Load video when it enters viewport
  useEffect(() => {
    if (hasIntersected && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [hasIntersected, shouldLoad]);

  const handleLoadedData = () => {
    setIsLoaded(true);
    onLoadedData?.();
  };

  const handleError = () => {
    setIsLoaded(false);
    onError?.();
  };

  // Expose play/pause methods to parent
  useImperativeHandle(ref, () => ({
    play: () => {
      if (isLoaded && videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    },
    pause: () => {
      if (isLoaded && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    },
  }), [isLoaded]);

  return (
    <div ref={elementRef} className="relative w-full h-full">
      {shouldLoad ? (
        <video
          ref={videoRef}
          className={className}
          style={style}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleLoadedData}
          onError={handleError}
        >
          <source src={src} type="video/webm" />
        </video>
      ) : (
        <div 
          className={cn(
            "w-full h-full bg-gray-200 animate-pulse",
            className
          )}
          style={style}
        />
      )}
    </div>
  );
});