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
import { useIsMobileHome } from "../../hooks/useIsMobileHome";
import { RadialGradient } from "../common/RadialGradient";
import { ANIMATION_CLASSES } from "../../constants/animations";

const VIDEO_TIMINGS = {
  FRESH_LOAD_START: 0,
  SPA_NAV_START: 8,
  CONTENT_SHOW_DELAY: 3000, // 3 seconds
} as const;

export interface VideoBackgroundRef {
  startVideo: () => void;
}

interface VideoBackgroundProps {
  showGradient?: boolean;
  gradientDelay?: number;
}

export const VideoBackground = forwardRef<
  VideoBackgroundRef,
  VideoBackgroundProps
>(({ showGradient = false, gradientDelay = 0 }, ref) => {
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


    video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
    video.muted = true;

    requestAnimationFrame(() => {
      video.play().catch(() => {
        // Mobile video autoplay failed - expected behavior
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


    video.pause();
    video.currentTime = VIDEO_TIMINGS.SPA_NAV_START;

    requestAnimationFrame(() => {
      video.play().catch(() => {
        // Video autoplay failed - expected behavior
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

    video.pause();
    requestAnimationFrame(() => {
      video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
    });
  }, [isHomePage, videoBehavior.shouldPlayFromStart, isMobile]);

  const startVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;


    video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;

    video.play().catch(() => {
      // Video play failed
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      startVideo,
    }),
    [startVideo],
  );

  const handleVideoPlay = () => {};

  if (!isHomePage) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      {/* Video Layer */}
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
        onLoadedData={() => {}}
      />
      
      {/* Gradient Overlay - Only affects video background */}
      {showGradient && !isMobile && (
        <div
          className={`fixed inset-0 pointer-events-none ${ANIMATION_CLASSES.TRANSITION} ${
            showGradient ? ANIMATION_CLASSES.VISIBLE : ANIMATION_CLASSES.HIDDEN
          }`}
          style={{
            zIndex: -19, // Just above video but below content
            transitionDelay: gradientDelay > 0 ? `${gradientDelay}ms` : undefined,
          }}
        >
          <RadialGradient
            size={1}
            opacity={0.95}
            className="w-full h-full"
            edgeColor="rgba(0, 0, 0, 1)"
            centerColor="transparent"
          />
        </div>
      )}
    </div>
  );
});
