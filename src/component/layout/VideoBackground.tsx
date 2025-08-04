import { useRouteBasedVideo } from "../../hooks/useRouteBasedVideo";
import { useVideo } from "../../hooks/useVideo";
import { useAppState } from "../../hooks/useAppState";
import { RadialGradient } from "../common/RadialGradient";
import { ANIMATION_CONFIG } from "../../constants/animations";
import { useRef, useEffect, useState, useCallback } from "react";
import { useLocation } from "wouter";

// Video timing configuration
const VIDEO_TIMINGS = {
  FRESH_LOAD_START: 0, // Start from beginning on fresh load
  INTERNAL_NAV_START: 8, // Start from 8s on internal navigation
  LAYOUT_SHOW_DELAY: 3000, // Show layout after 3s of video play
} as const;

export const VideoBackground = () => {
  const { shouldPlayVideo } = useRouteBasedVideo();
  const { shouldShowLayout, setShouldShowLayout } = useVideo();
  const { shouldPlayFromStart, shouldJumpTo8s, preloadComplete } = useAppState();
  const [location] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

  const isHomePage = location === "/";
  
  // Handle video behavior for SPA navigation - jump to 8s and play
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlayVideo || !isHomePage) return;

    if (shouldJumpTo8s && preloadComplete) {
      console.log("🎬 SPA navigation - jumping to 8s and playing");
      // Safari-specific: Ensure proper state reset before seeking
      video.pause();
      video.currentTime = VIDEO_TIMINGS.INTERNAL_NAV_START;
      
      requestAnimationFrame(() => {
        video.play().catch(console.error);
      });
    }
  }, [shouldJumpTo8s, shouldPlayVideo, isHomePage, preloadComplete]);

  // Handle video behavior for fresh load - set to start and pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlayVideo || !isHomePage || hasStartedPlaying) return;

    if (shouldPlayFromStart) {
      console.log("🎬 Fresh load - setting video to start and pausing");
      // Safari-specific: Force pause first, then set currentTime
      video.pause();
      requestAnimationFrame(() => {
        video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
      });
    }
  }, [shouldPlayFromStart, shouldPlayVideo, isHomePage, hasStartedPlaying]);

  const handleVideoReady = () => {
    console.log("🎬 Video loaded and ready");
    // Remove conflicting pause logic - let other effects handle video control
  };

  const handleVideoPlay = () => {
    console.log("🎬 Video started playing, beginning layout sequence");
    setTimeout(() => {
      console.log("🎬 Video sequence complete, showing layout");
      setShouldShowLayout(true);
    }, ANIMATION_CONFIG.FADE_IN_DELAY);
  };

  const startVideo = useCallback(() => {
    const video = videoRef.current;
    if (video && shouldPlayFromStart) {
      console.log("🎬 Starting video from dive-in button at:", VIDEO_TIMINGS.FRESH_LOAD_START);
      setHasStartedPlaying(true); // Mark that user has started the video
      
      // Safari-specific: Force video to reset state before setting currentTime
      video.pause();
      video.currentTime = VIDEO_TIMINGS.FRESH_LOAD_START;
      
      // Use requestAnimationFrame to ensure currentTime is set before playing
      requestAnimationFrame(() => {
        video.play().catch(console.error);
      });
    }
  }, [shouldPlayFromStart]);

  // Expose startVideo function globally for the DiveInButton
  useEffect(() => {
    const windowWithVideo = window as Window & { startHomeVideo?: () => void };
    if (shouldPlayVideo) {
      windowWithVideo.startHomeVideo = startVideo;
    }
    return () => {
      delete windowWithVideo.startHomeVideo;
    };
  }, [shouldPlayVideo, startVideo]);

  if (!shouldPlayVideo) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        autoPlay={false}
        playsInline
        disablePictureInPicture
        preload="auto"
        src="/videos/intro.mp4"
        onCanPlayThrough={handleVideoReady}
        onPlay={handleVideoPlay}
      />
      {shouldShowLayout && (
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
};
