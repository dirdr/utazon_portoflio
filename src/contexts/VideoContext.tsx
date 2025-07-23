import { createContext, useContext, useRef, useState, useEffect, ReactNode, useCallback } from "react";
import { ANIMATION_CONFIG } from "../constants/animations";

// Combined types for both video playback and settings
export interface VideoContextState {
  // Playback state
  videoRef: React.RefObject<HTMLVideoElement>;
  introSrc: string;
  isLoading: boolean;
  hasUserInteracted: boolean;
  shouldPlayVideo: boolean;
  shouldShowLayout: boolean;
  currentPage: string;
  
  // Settings state
  volume: number;
  isMuted: boolean;
}

export interface VideoContextActions {
  // Playback actions
  startVideo: () => void;
  setCurrentPage: (page: string) => void;
  
  // Settings actions
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

export interface VideoContextProps extends VideoContextState, VideoContextActions {}

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Playback state
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const [shouldShowLayout, setShouldShowLayout] = useState(false);
  
  // Settings state
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMutedState] = useState(false);

  const introSrc = "/videos/intro.webm";
  const shouldPlayVideo = currentPage === "/";

  // Playback methods
  const startVideo = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || hasUserInteracted || !shouldPlayVideo) return;

    try {
      setHasUserInteracted(true);
      await videoElement.play();
    } catch (error) {
      console.warn("Video autoplay failed:", error);
    }
  }, [hasUserInteracted, shouldPlayVideo]);

  // Settings methods
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const toggleMute = () => {
    setIsMutedState(prev => !prev);
  };

  const setMuted = (muted: boolean) => {
    setIsMutedState(muted);
  };

  // Video loading and autoplay logic
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
            setShouldShowLayout(true);
          }, ANIMATION_CONFIG.FADE_IN_DELAY);
        } catch (error) {
          console.warn("Video autoplay failed:", error);
          setShouldShowLayout(true);
        }
      } else {
        setShouldShowLayout(true);
      }
    };

    videoElement.src = introSrc;
    videoElement.addEventListener("canplaythrough", handleIntroCanPlay, {
      once: true,
    });

    return () => {
      videoElement.removeEventListener("canplaythrough", handleIntroCanPlay);
    };
  }, [introSrc, shouldPlayVideo]);

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
  }, [shouldPlayVideo, isLoading]);

  useEffect(() => {
    setShouldShowLayout(currentPage !== "/");
  }, [currentPage]);

  const value: VideoContextProps = {
    // Playback state
    videoRef,
    introSrc,
    isLoading,
    hasUserInteracted,
    shouldPlayVideo,
    shouldShowLayout,
    currentPage,
    
    // Settings state
    volume,
    isMuted,
    
    // Actions
    startVideo,
    setCurrentPage,
    setVolume,
    toggleMute,
    setMuted,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};