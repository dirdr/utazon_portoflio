import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { useLocation } from "wouter";
import { useAppLoading } from "../../contexts/AppLoadingContext";
import { RadialGradient } from "../common/RadialGradient";
import { useIsMobileHome } from "../../hooks/useIsMobileHome";

const VIDEO_TIMINGS = {
  FRESH_LOAD_START: 0,
  SPA_NAV_START: 8,
  CONTENT_SHOW_DELAY: 3000, // 3 seconds
} as const;

export interface VideoBackgroundRef {
  startVideo: () => void;
}

interface VideoBackgroundProps {
  showContent?: boolean;
}

export const VideoBackground = forwardRef<
  VideoBackgroundRef,
  VideoBackgroundProps
>(({ showContent = false }, ref) => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isMobile = useIsMobileHome();

  const { videoBehavior } = useAppLoading();

  const videoRef = useRef<HTMLVideoElement>(null);

  const videoSource = useMemo(() => {
    return isMobile ? "/videos/intro_mobile.mp4" : "/videos/intro.mp4";
  }, [isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage) return;

    video.style.transform = "translate3d(0, 0, 0)";
    video.style.willChange = "transform";
    video.style.backfaceVisibility = "hidden";
  }, [isHomePage]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage || !isMobile) return;

    console.log("📱 Mobile detected - starting video immediately, muted");

    video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
    video.muted = true;

    requestAnimationFrame(() => {
      video.play().catch((error) => {
        console.error("Mobile video autoplay failed:", error);
      });
    });
  }, [isHomePage, isMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (
      !video ||
      !isHomePage ||
      !videoBehavior.shouldJumpTo8s ||
      videoBehavior.isDiveInFlow ||
      isMobile
    )
      return;

    console.log("🎬 SPA navigation - jumping to 8s and playing");

    video.pause();
    video.currentTime = VIDEO_TIMINGS.SPA_NAV_START;

    requestAnimationFrame(() => {
      video.play().catch((error) => {
        console.error("Video autoplay failed (expected):", error);
      });
    });
  }, [
    isHomePage,
    videoBehavior.shouldJumpTo8s,
    videoBehavior.isDiveInFlow,
    isMobile,
  ]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage || !videoBehavior.shouldPlayFromStart || isMobile)
      return;

    console.log("🎬 Fresh load - setting video to start position, paused");
    video.pause();
    requestAnimationFrame(() => {
      video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
    });
  }, [isHomePage, videoBehavior.shouldPlayFromStart, isMobile]);

  const startVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log("🎬 Starting video immediately from dive-in button click");

    video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;

    video.play().catch((error) => {
      console.error("Video play failed:", error);
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      startVideo,
    }),
    [startVideo],
  );

  const handleVideoPlay = () => {
    console.log("🎬 Video started playing");
  };

  if (!isHomePage) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover gpu-accelerated"
        muted={isMobile}
        autoPlay={false}
        playsInline
        disablePictureInPicture
        preload="metadata"
        src={videoSource}
        onPlay={handleVideoPlay}
        onLoadedData={() => console.log("🎬 Video data loaded and ready")}
      />
      {showContent && (
        <RadialGradient
          size={1}
          opacity={0.95}
          className="absolute inset-0"
          edgeColor="rgba(0, 0, 0, 1)"
          centerColor="transparent"
        />
      )}
    </div>
  );
});
