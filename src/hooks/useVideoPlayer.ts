import { useCallback, useEffect, useState, RefObject } from "react";
import { ANIMATION_CONFIG } from "../constants/animations";

interface UseVideoPlayerProps {
  videoRef: RefObject<HTMLVideoElement>;
  shouldPlayVideo: boolean;
  introSrc: string;
  onLayoutShow?: () => void;
}

export const useVideoPlayer = ({
  videoRef,
  shouldPlayVideo,
  introSrc,
  onLayoutShow,
}: UseVideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMutedState] = useState(false);

  const startVideo = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || hasUserInteracted || !shouldPlayVideo) return;
    
    try {
      setHasUserInteracted(true);
      await videoElement.play();
    } catch (error) {
      console.warn("Video autoplay failed:", error);
    }
  }, [hasUserInteracted, shouldPlayVideo, videoRef]);

  const setVolume = (newVolume: number) => setVolumeState(newVolume);
  const toggleMute = () => setIsMutedState((prev) => !prev);
  const setMuted = (muted: boolean) => setIsMutedState(muted);

  // Handle video loading and initial play
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleIntroCanPlay = async () => {
      setIsLoading(false);
      if (shouldPlayVideo) {
        try {
          await videoElement.play();
          setHasUserInteracted(true);
          setTimeout(() => {
            onLayoutShow?.();
          }, ANIMATION_CONFIG.FADE_IN_DELAY);
        } catch (error) {
          console.warn("Video autoplay failed:", error);
          onLayoutShow?.();
        }
      } else {
        onLayoutShow?.();
      }
    };

    videoElement.src = introSrc;
    videoElement.addEventListener("canplaythrough", handleIntroCanPlay, {
      once: true,
    });

    return () => {
      videoElement.removeEventListener("canplaythrough", handleIntroCanPlay);
    };
  }, [introSrc, shouldPlayVideo, videoRef, onLayoutShow]);

  // Handle play/pause based on shouldPlayVideo
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (shouldPlayVideo && !isLoading) {
      videoElement.play().catch((error) => {
        console.warn("Video play failed:", error);
      });
    } else {
      videoElement.pause();
      videoElement.currentTime = 0;
    }
  }, [shouldPlayVideo, isLoading, videoRef]);

  return {
    isLoading,
    hasUserInteracted,
    volume,
    isMuted,
    startVideo,
    setVolume,
    toggleMute,
    setMuted,
  };
};