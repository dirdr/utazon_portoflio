import {
  useRef,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { VideoContext } from "./VideoContext";
import { ANIMATION_CONFIG } from "../../constants/animations";

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const [shouldShowLayout, setShouldShowLayout] = useState(false);

  const introSrc = "/videos/intro.webm";
  const shouldPlayVideo = currentPage === "/";

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

  const value = {
    videoRef,
    introSrc,
    isLoading,
    startVideo,
    hasUserInteracted,
    shouldPlayVideo,
    setCurrentPage,
    shouldShowLayout,
    currentPage,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
};