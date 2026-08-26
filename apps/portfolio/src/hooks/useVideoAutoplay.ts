import { useRef, useState, useEffect, RefObject } from "react";

export interface UseVideoAutoplayOptions {
  /**
   * Whether to enable autoplay
   * @default true
   */
  enabled?: boolean;

  /**
   * Delay before retrying autoplay (in ms)
   * @default 500
   */
  retryDelay?: number;

  /**
   * Number of retry attempts
   * @default 3
   */
  maxRetries?: number;

  /**
   * Whether to log autoplay failures
   * @default true
   */
  logErrors?: boolean;
}

export interface UseVideoAutoplayReturn {
  /**
   * Ref to attach to the video element
   */
  videoRef: RefObject<HTMLVideoElement | null>;

  /**
   * Whether the video is ready to play
   */
  isReady: boolean;

  /**
   * Whether the video has an error
   */
  hasError: boolean;

  /**
   * Whether the video is currently playing
   */
  isPlaying: boolean;

  /**
   * Manually trigger play attempt
   */
  play: () => Promise<void>;

  /**
   * Props to spread on the video element for mobile compatibility
   */
  videoProps: {
    muted: boolean;
    loop: boolean;
    playsInline: boolean;
    disablePictureInPicture: boolean;
    disableRemotePlayback: boolean;
    preload: "metadata" | "auto";
    "webkit-playsinline": "true";
    "x5-playsinline": "true";
    style: {
      transform: string;
      backfaceVisibility: "hidden";
    };
    onLoadedData: () => void;
    onLoadedMetadata: () => void;
    onCanPlay: () => void;
    onPlay: () => void;
    onPause: () => void;
    onError: () => void;
  };
}

/**
 * Centralized hook for video autoplay with mobile browser compatibility
 *
 * Features:
 * - Automatic retry mechanism for failed autoplay
 * - Mobile-optimized attributes (webkit-playsinline, x5-playsinline)
 * - Multiple ready state listeners for Safari compatibility
 * - GPU acceleration for smooth playback
 * - Comprehensive error handling
 *
 * @example
 * ```tsx
 * const { videoRef, isReady, videoProps } = useVideoAutoplay();
 *
 * return <video ref={videoRef} src={videoUrl} {...videoProps} />;
 * ```
 */
export const useVideoAutoplay = (
  options: UseVideoAutoplayOptions = {},
): UseVideoAutoplayReturn => {
  const {
    enabled = true,
    retryDelay = 500,
    maxRetries = 3,
    logErrors = true,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const retryCountRef = useRef(0);

  /**
   * Attempt to play the video with error handling
   */
  const play = async (): Promise<void> => {
    const videoEl = videoRef.current;
    if (!videoEl || !enabled) return;

    try {
      await videoEl.play();
      setIsPlaying(true);
      retryCountRef.current = 0; // Reset retry count on success
    } catch (err) {
      if (logErrors) {
        console.log(
          `Video autoplay failed (attempt ${retryCountRef.current + 1}/${maxRetries}):`,
          err,
        );
      }

      // Retry if we haven't exceeded max attempts
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        setTimeout(() => {
          play();
        }, retryDelay);
      }
    }
  };

  /**
   * Autoplay when video is ready
   */
  useEffect(() => {
    if (isReady && enabled && !hasError) {
      play();
    }

    // Cleanup timeout on unmount
    return () => {
      retryCountRef.current = 0;
    };
  }, [isReady, enabled, hasError]);

  /**
   * Additional retry mechanism for paused videos
   */
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !enabled || !isReady || hasError) return;

    const retryTimeout = setTimeout(() => {
      if (videoEl.paused && retryCountRef.current < maxRetries) {
        play();
      }
    }, retryDelay);

    return () => clearTimeout(retryTimeout);
  }, [isReady, enabled, hasError, retryDelay, maxRetries]);

  /**
   * Mobile-optimized video props
   */
  const videoProps: UseVideoAutoplayReturn["videoProps"] = {
    // Core autoplay requirements
    muted: true, // Required for autoplay on all browsers
    loop: true, // Continuous playback
    playsInline: true, // Prevents fullscreen on iOS

    // Mobile browser compatibility
    "webkit-playsinline": "true", // Legacy iOS Safari
    "x5-playsinline": "true", // WeChat & Chinese browsers

    // Additional settings
    disablePictureInPicture: true,
    disableRemotePlayback: true,
    preload: "metadata",

    // GPU acceleration for smooth playback
    style: {
      transform: "translateZ(0)",
      backfaceVisibility: "hidden",
    },

    // Event handlers for cross-browser compatibility
    onLoadedData: () => setIsReady(true),
    onLoadedMetadata: () => setIsReady(true), // Safari compatibility
    onCanPlay: () => setIsReady(true), // Additional Safari support
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onError: () => {
      setIsReady(false);
      setHasError(true);
      setIsPlaying(false);
    },
  };

  return {
    videoRef,
    isReady,
    hasError,
    isPlaying,
    play,
    videoProps,
  };
};
