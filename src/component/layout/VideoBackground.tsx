import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { useLocation } from "wouter";
import { RadialGradient } from "../common/RadialGradient";
import { ANIMATION_CLASSES } from "../../constants/animations";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";
import { isMobile } from "../../utils/mobileDetection";

export interface VideoBackgroundRef {
  startVideo: () => void;
  setMuted: (muted: boolean) => void;
  video: HTMLVideoElement | null;
}

interface VideoBackgroundProps {
  src?: string;
  showGradient?: boolean;
  gradientDelay?: number;
  onLoadedData?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  onEnded?: () => void;
}

export const VideoBackground = forwardRef<
  VideoBackgroundRef,
  VideoBackgroundProps
>(
  (
    {
      src,
      showGradient = false,
      gradientDelay = 0,
      onLoadedData,
      onTimeUpdate,
      onEnded,
    },
    ref,
  ) => {
    const [location] = useLocation();
    const isHomePage = location === "/";
    const isMobileDetected = isMobile();

    const videoRef = useRef<HTMLVideoElement>(null);

    const loadedSources = useRef(new Set<string>());

    const videoSource = useMemo(() => {
      if (src) return src;
      return isMobileDetected
        ? "/videos/intro_mobile.mp4"
        : "/videos/intro.mp4";
    }, [src, isMobileDetected]);

    useEffect(() => {
      loadedSources.current.clear();
    }, [videoSource]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !isHomePage) return;

      const currentSource = video.src;
      const hasAlreadyNotifiedLoad = loadedSources.current.has(currentSource);

      const handleLoadedData = () => {
        if (!loadedSources.current.has(currentSource)) {
          loadedSources.current.add(currentSource);
          onLoadedData?.();
        }
      };

      const handleTimeUpdate = (e: Event) => {
        onTimeUpdate?.(e as unknown as React.SyntheticEvent<HTMLVideoElement>);
      };

      const handleEnded = () => {
        onEnded?.();
      };

      const handlePlay = () => {};

      const handlePause = () => {};

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);

      if (video.readyState >= 2 && !hasAlreadyNotifiedLoad) {
        loadedSources.current.add(currentSource);
        setTimeout(() => onLoadedData?.(), 0);
      }

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
      };
    }, [isHomePage, onLoadedData, onTimeUpdate, onEnded]);

    const startVideo = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = 0;
      video.play().catch(() => {});
    }, []);

    const setMuted = useCallback((muted: boolean) => {
      const video = videoRef.current;
      if (!video) return;

      video.muted = muted;
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        startVideo,
        setMuted,
        video: videoRef.current,
      }),
      [startVideo, setMuted],
    );

    if (!isHomePage) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 video-container"
        style={{ zIndex: OVERLAY_Z_INDEX.VIDEO_BACKGROUND }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover gpu-accelerated"
          muted={isMobileDetected}
          autoPlay={isMobileDetected}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          crossOrigin="anonymous"
          src={videoSource}
          style={{
            contentVisibility: "auto",
            willChange: "auto",
          }}
        />

        {!isMobile() && (
          <div
            className={`fixed inset-0 pointer-events-none ${
              ANIMATION_CLASSES.TRANSITION
            } ${showGradient ? ANIMATION_CLASSES.VISIBLE : ANIMATION_CLASSES.HIDDEN}`}
            style={{
              zIndex: OVERLAY_Z_INDEX.VIDEO_GRADIENT,
              transitionDelay:
                gradientDelay > 0 ? `${gradientDelay}ms` : undefined,
            }}
          >
            <RadialGradient
              size={15}
              opacity={0.5}
              className="w-full h-full"
              edgeColor="rgba(0, 0, 0, 0.95)"
              centerColor="transparent"
            />
          </div>
        )}
      </div>
    );
  },
);
