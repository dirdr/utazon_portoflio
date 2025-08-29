import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { useLocation } from "wouter";
import { useIsMobileHome } from "../../hooks/useIsMobileHome";
import { RadialGradient } from "../common/RadialGradient";
import { ANIMATION_CLASSES } from "../../constants/animations";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";

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
    const isMobile = useIsMobileHome();

    const videoRef = useRef<HTMLVideoElement>(null);

    const videoSource = useMemo(() => {
      if (src) return src;
      return isMobile ? "/videos/intro_mobile.mp4" : "/videos/intro.mp4";
    }, [src, isMobile]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !isHomePage) return;

      const handleLoadedData = () => {
        onLoadedData?.();
      };

      const handleTimeUpdate = (e: Event) => {
        onTimeUpdate?.(e as unknown as React.SyntheticEvent<HTMLVideoElement>);
      };

      const handleEnded = () => {
        onEnded?.();
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("ended", handleEnded);
      };
    }, [isHomePage, onLoadedData, onTimeUpdate, onEnded]);

    const startVideo = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = 0;
      video.play().catch(console.error);
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
        className="fixed inset-0"
        style={{ zIndex: OVERLAY_Z_INDEX.VIDEO_BACKGROUND }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover gpu-accelerated"
          muted={false}
          autoPlay={false}
          playsInline
          disablePictureInPicture
          preload="metadata"
          src={videoSource}
        />

        {!isMobile && (
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
