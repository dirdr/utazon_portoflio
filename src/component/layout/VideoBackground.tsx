import { useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useLocation } from "wouter";
import { useAppLoading } from "../../contexts/AppLoadingContext";
import { RadialGradient } from "../common/RadialGradient";

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

export const VideoBackground = forwardRef<VideoBackgroundRef, VideoBackgroundProps>(({ showContent = false }, ref) => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  
  const { 
    videoBehavior
  } = useAppLoading();
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Setup video for hardware acceleration and immediate readiness
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage) return;

    // Hardware acceleration
    video.style.transform = "translate3d(0, 0, 0)";
    video.style.willChange = "transform";
    video.style.backfaceVisibility = "hidden";
  }, [isHomePage]);

  // Handle SPA navigation - auto-start video at 8s
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage || !videoBehavior.shouldJumpTo8s || videoBehavior.isDiveInFlow) return;

    console.log("🎬 SPA navigation - jumping to 8s and playing");
    
    video.pause();
    video.currentTime = VIDEO_TIMINGS.SPA_NAV_START;
    
    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => {
      video.play().catch(error => {
        console.error("Video autoplay failed (expected):", error);
      });
    });
  }, [isHomePage, videoBehavior.shouldJumpTo8s, videoBehavior.isDiveInFlow]);

  // Setup video for fresh loads (paused at start, ready for user interaction)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHomePage || !videoBehavior.shouldPlayFromStart) return;

    console.log("🎬 Fresh load - setting video to start position, paused");
    video.pause();
    requestAnimationFrame(() => {
      video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
    });
  }, [isHomePage, videoBehavior.shouldPlayFromStart]);

  const startVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log("🎬 Starting video immediately from dive-in button click");
    
    // Always start from 0 for user-initiated playback
    video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
    
    // Start playing immediately without requestAnimationFrame delay
    video.play().catch(error => {
      console.error("Video play failed:", error);
    });
  }, []);

  // Expose startVideo method through ref
  useImperativeHandle(ref, () => ({
    startVideo,
  }), [startVideo]);

  const handleVideoPlay = () => {
    console.log("🎬 Video started playing");
    // Content visibility is now handled by HomeContainer
  };

  if (!isHomePage) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover gpu-accelerated"
        muted={false}
        autoPlay={false}
        playsInline
        disablePictureInPicture
        preload="metadata"
        src="/videos/intro.mp4"
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
