import {
  useVideoAutoplay,
  UseVideoAutoplayOptions,
} from "../../hooks/useVideoAutoplay";
import { cn } from "../../utils/cn";

export interface AutoplayVideoProps extends UseVideoAutoplayOptions {
  /**
   * Video source URL
   */
  src: string;

  /**
   * Alt text for accessibility
   */
  alt?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;

  /**
   * Callback when video starts playing
   */
  onPlayStart?: () => void;

  /**
   * Callback when video pauses
   */
  onPlayPause?: () => void;

  /**
   * Callback when video encounters an error
   */
  onPlayError?: () => void;

  /**
   * Whether to show a loading indicator
   * @default false
   */
  showLoader?: boolean;

  /**
   * Whether to show an error message
   * @default true
   */
  showError?: boolean;

  /**
   * Custom error message
   */
  errorMessage?: string;
}

/**
 * Reusable autoplay video component with mobile browser compatibility
 *
 * Features:
 * - Automatic retry mechanism for failed autoplay
 * - Mobile-optimized attributes (webkit-playsinline, x5-playsinline)
 * - Multiple ready state listeners for Safari compatibility
 * - GPU acceleration for smooth playback
 * - Comprehensive error handling
 * - Loading state support
 *
 * @example
 * ```tsx
 * <AutoplayVideo
 *   src={videoUrl}
 *   className="w-full h-full object-cover"
 *   showLoader={true}
 * />
 * ```
 */
export const AutoplayVideo = ({
  src,
  alt,
  className,
  style,
  onPlayStart,
  onPlayPause,
  onPlayError,
  showLoader = false,
  showError = true,
  errorMessage = "Video unavailable",
  ...autoplayOptions
}: AutoplayVideoProps) => {
  const { videoRef, isReady, hasError, videoProps } =
    useVideoAutoplay(autoplayOptions);

  // Merge custom callbacks with videoProps
  const enhancedVideoProps = {
    ...videoProps,
    onPlay: () => {
      videoProps.onPlay();
      onPlayStart?.();
    },
    onPause: () => {
      videoProps.onPause();
      onPlayPause?.();
    },
    onError: () => {
      videoProps.onError();
      onPlayError?.();
    },
  };

  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Loading indicator */}
      {showLoader && !isReady && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div
            className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full"
            style={{ animation: "spin 1s linear infinite" }}
            aria-label="Loading video"
          />
        </div>
      )}

      {/* Video element */}
      {!hasError && src && (
        <video
          ref={videoRef}
          className={cn("w-full h-full object-cover", className)}
          src={src}
          aria-label={alt}
          {...enhancedVideoProps}
          style={{ ...enhancedVideoProps.style, ...style }}
        />
      )}

      {/* Error state */}
      {showError && hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <p className="text-white text-sm">{errorMessage}</p>
        </div>
      )}
    </div>
  );
};
