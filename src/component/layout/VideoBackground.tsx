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
import { OVERLAY_Z_INDEX } from "../common/OverlayManager";

const VIDEO_TIMINGS = {
  FRESH_LOAD_START: 0,
  SPA_NAV_START: 8,
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

  const videoSource = useMemo(() => (
    isMobile ? "/videos/intro_mobile.mp4" : "/videos/intro.mp4"
  ), [isMobile]);

  // GPU acceleration optimization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage) return;

    // Apply GPU acceleration for smooth video playback
    Object.assign(video.style, {
      transform: "translate3d(0, 0, 0)",
      willChange: "transform",
      backfaceVisibility: "hidden"
    });
  }, [isHomePage]);

  // Initialize mobile video autoplay
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

  // Handle SPA navigation - jump to 8s
  useEffect(() => {
    const video = videoRef.current;
    
    if (
      !video ||
      !isHomePage ||
      !videoBehavior.shouldJumpTo8s ||
      videoBehavior.isDiveInFlow ||
      isMobile
    ) {
      return;
    }

    video.pause();
    video.currentTime = VIDEO_TIMINGS.SPA_NAV_START;

    requestAnimationFrame(() => {
      video.play().catch(() => {
        // Video autoplay failed - expected in some browsers
      });
    });
  }, [
    isHomePage,
    videoBehavior.shouldJumpTo8s,
    videoBehavior.isDiveInFlow,
    isMobile,
  ]);

  // Handle fresh load - prepare video from start
  useEffect(() => {
    const video = videoRef.current;
    
    if (!video || !isHomePage || !videoBehavior.shouldPlayFromStart || isMobile) {
      return;
    }

    video.pause();
    requestAnimationFrame(() => {
      video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
    });
  }, [isHomePage, videoBehavior.shouldPlayFromStart, isMobile]);

  // Handle video replay when it ends
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage) return;

    const handleVideoEnded = () => {
      if (isMobile) {
        // Mobile: replay from 0 seconds
        video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
      } else {
        // Desktop: replay from 8 seconds
        video.currentTime = VIDEO_TIMINGS.SPA_NAV_START;
      }
      
      requestAnimationFrame(() => {
        video.play().catch(() => {
          // Video autoplay failed - expected in some browsers
        });
      });
    };

    video.addEventListener('ended', handleVideoEnded);

    return () => {
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, [isHomePage, isMobile]);

  const startVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;

    video.play().catch(() => {
      // Video play failed - expected in some browsers
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      startVideo,
    }),
    [startVideo],
  );


  if (!isHomePage) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: OVERLAY_Z_INDEX.VIDEO_BACKGROUND }}>
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
      />
      
      {/* Gradient Overlay - Desktop only */}
      {!isMobile && (
        <div
          className={`fixed inset-0 pointer-events-none ${
            ANIMATION_CLASSES.TRANSITION
          } ${showGradient ? ANIMATION_CLASSES.VISIBLE : ANIMATION_CLASSES.HIDDEN}`}
          style={{
            zIndex: OVERLAY_Z_INDEX.VIDEO_BACKGROUND + 1,
            transitionDelay: gradientDelay > 0 ? `${gradientDelay}ms` : undefined,
          }}
        >
          <RadialGradient
            size={20}
            opacity={0.8}
            className="w-full h-full"
            edgeColor="rgba(255, 0, 0, 0.8)"
            centerColor="transparent"
          />
        </div>
      )}
    </div>
  );
});
