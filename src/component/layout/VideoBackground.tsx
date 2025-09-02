import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { useLocation } from "wouter";
import { useHomeMobileBreakpoint } from "../../hooks/useHomeMobileBreakpoint";
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
    const isMobile = useHomeMobileBreakpoint();

    const videoRef = useRef<HTMLVideoElement>(null);

    const videoSource = useMemo(() => {
      if (src) return src;
      return isMobile ? "/videos/intro_mobile.mp4" : "/videos/intro.mp4";
    }, [src, isMobile]);

    useEffect(() => {
      const video = videoRef.current;
      if (!video || !isHomePage) return;

      console.log("📺 VideoBackground: Setting up video events", {
        readyState: video.readyState,
        currentSrc: video.currentSrc,
        paused: video.paused,
        currentTime: video.currentTime,
        timestamp: Date.now()
      });

      const handleLoadedData = () => {
        console.log("🎬 VideoBackground: loadeddata event fired", {
          readyState: video.readyState,
          currentTime: video.currentTime,
          paused: video.paused,
          timestamp: Date.now()
        });
        onLoadedData?.();
      };

      const handleTimeUpdate = (e: Event) => {
        onTimeUpdate?.(e as unknown as React.SyntheticEvent<HTMLVideoElement>);
      };

      const handleEnded = () => {
        console.log("🏁 VideoBackground: Video ended");
        onEnded?.();
      };

      const handlePlay = () => {
        console.log("▶️ VideoBackground: Video started playing", {
          currentTime: video.currentTime,
          timestamp: Date.now()
        });
      };

      const handlePause = () => {
        console.log("⏸️ VideoBackground: Video paused", {
          currentTime: video.currentTime,
          timestamp: Date.now()
        });
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("ended", handleEnded);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);

      // If video is already loaded, trigger callback immediately
      if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
        console.log("⚡ VideoBackground: Video already loaded, triggering callback immediately", {
          readyState: video.readyState,
          timestamp: Date.now()
        });
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
        className="fixed inset-0 video-container"
        style={{ zIndex: OVERLAY_Z_INDEX.VIDEO_BACKGROUND }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover gpu-accelerated"
          muted={false}
          autoPlay={false}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          crossOrigin="anonymous"
          src={videoSource}
          style={{
            contentVisibility: 'auto',
            willChange: 'auto',
          }}
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
