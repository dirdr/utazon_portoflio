import {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "../../utils/cn";

interface OptimizedVideoThumbnailProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  onLoadedData?: () => void;
  onError?: () => void;
  width?: number;
  height?: number;
}

export interface OptimizedVideoThumbnailRef {
  play: () => void;
  pause: () => void;
  reset: () => void;
}

export const OptimizedVideoThumbnail = forwardRef<
  OptimizedVideoThumbnailRef,
  OptimizedVideoThumbnailProps
>(
  (
    {
      src,
      poster,
      alt,
      className,
      style,
      priority = false,
      onLoadedData,
      onError,
      width,
      height,
    },
    ref,
  ) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { ref: inViewRef, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
      rootMargin: priority ? "0px" : "50px",
    });

    const handleVideoLoaded = () => {
      setIsVideoLoaded(true);
      onLoadedData?.();
    };

    const handleVideoError = () => {
      setHasError(true);
      setIsVideoLoaded(false);
      onError?.();
    };

    const play = useCallback(async () => {
      if (isVideoLoaded && videoRef.current && !isPlaying) {
        try {
          videoRef.current.currentTime = 0;
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.warn("Video play failed:", error);
        }
      }
    }, [isVideoLoaded, isPlaying]);

    const pause = useCallback(() => {
      if (videoRef.current && isPlaying) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }, [isPlaying]);

    const reset = useCallback(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        play,
        pause,
        reset,
      }),
      [play, pause, reset],
    );

    const setRefs = (element: HTMLDivElement | null) => {
      inViewRef(element);
    };

    return (
      <div
        ref={setRefs}
        className={cn("relative overflow-hidden", className)}
        style={{
          ...style,
          ...(width && height && { aspectRatio: `${width}/${height}` }),
        }}
      >
        {priority && (
          <link rel="preload" href={poster} as="image" fetchPriority="high" />
        )}

        <img
          src={poster}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isVideoLoaded && isPlaying ? "opacity-0" : "opacity-100",
          )}
          style={style}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(width && height && { width, height })}
        />

        {inView && !hasError && (
          <video
            ref={videoRef}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-300",
              isVideoLoaded && isPlaying ? "opacity-100" : "opacity-0",
            )}
            style={style}
            muted
            loop
            playsInline
            preload="none"
            poster={poster}
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
            onEnded={() => setIsPlaying(false)}
            {...(width && height && { width, height })}
          >
            <source src={src} type="video/webm" />
          </video>
        )}

        {inView && !isVideoLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
            Video unavailable
          </div>
        )}
      </div>
    );
  },
);

