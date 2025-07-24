import { useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface LazyVideoProps {
  src: string;
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
  className,
  style,
  onLoadedData,
  onError,
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    <div className="relative w-full h-full">
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
    </div>
  );
});