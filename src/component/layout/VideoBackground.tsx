import { useRouteBasedVideo } from "../../hooks/useRouteBasedVideo";
import { useVideo } from "../../hooks/useVideo";
import { useDiveInInitialization } from "../../hooks/useDiveInInitialization";
import { RadialGradient } from "../common/RadialGradient";
import { ANIMATION_CONFIG } from "../../constants/animations";
import { useRef, useEffect } from "react";
import { useLocation } from "wouter";

export const VideoBackground = () => {
  const { shouldPlayVideo } = useRouteBasedVideo();
  const { shouldShowLayout, setShouldShowLayout } = useVideo();
  const { isFreshLoad } = useDiveInInitialization();
  const [location] = useLocation();
  const videoRef = useRef<HTMLVideoElement>(null);

  const isHomePage = location === "/";
  const shouldAutoPlayVideo = isHomePage && !isFreshLoad;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldPlayVideo) return;

    if (shouldAutoPlayVideo) {
      console.log("🎬 Auto-playing video (internal navigation)");
      video.currentTime = 0;
      video.play().catch(console.error);
    } else {
      console.log(
        "🎬 Video ready but waiting for user interaction (fresh load)",
      );
      video.pause();
      video.currentTime = 0;
    }
  }, [shouldAutoPlayVideo, shouldPlayVideo]);

  const handleVideoReady = () => {
    console.log("🎬 Video loaded and ready");
  };

  const handleVideoPlay = () => {
    console.log("🎬 Video started playing, beginning layout sequence");
    setTimeout(() => {
      console.log("🎬 Video sequence complete, showing layout");
      setShouldShowLayout(true);
    }, ANIMATION_CONFIG.FADE_IN_DELAY);
  };

  const startVideo = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(console.error);
    }
  };

  // Expose startVideo function globally for the DiveInButton
  useEffect(() => {
    const windowWithVideo = window as Window & { startHomeVideo?: () => void };
    if (shouldPlayVideo) {
      windowWithVideo.startHomeVideo = startVideo;
    }
    return () => {
      delete windowWithVideo.startHomeVideo;
    };
  }, [shouldPlayVideo]);

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
