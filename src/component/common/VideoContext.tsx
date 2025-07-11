import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ANIMATION_CONFIG } from "../../constants/animations";

interface VideoContextProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  handleVideoEnded: () => void;
  introSrc: string;
  isLoading: boolean;
  startVideo: () => void;
  hasUserInteracted: boolean;
  shouldPlayVideo: boolean;
  setCurrentPage: (page: string) => void;
  shouldShowLayout: boolean;
}

export const VideoContext = createContext<VideoContextProps | undefined>(
  undefined,
);

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [currentPage, setCurrentPage] = useState("/");
  const [shouldShowLayout, setShouldShowLayout] = useState(false);

  const introSrc = "/videos/intro.webm";
  const shouldPlayVideo = currentPage === "/";

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleIntroCanPlay = async () => {
      setIsLoading(false);
      if (shouldPlayVideo) {
        try {
          await videoElement.play();
          setHasUserInteracted(true);
          
          // Show layout after video starts with configured delay
          setTimeout(() => {
            setShouldShowLayout(true);
          }, ANIMATION_CONFIG.FADE_IN_DELAY);
        } catch (error) {
          console.warn("Video autoplay failed:", error);
          // Show layout immediately if video fails
          setShouldShowLayout(true);
        }
      } else {
        // Show layout immediately on non-home pages
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
      setShouldShowLayout(true); // Show layout immediately on non-home pages
    }
  }, [shouldPlayVideo, isLoading]);

  // Reset layout visibility when page changes
  useEffect(() => {
    setShouldShowLayout(currentPage !== "/");
  }, [currentPage]);


  const startVideo = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || hasUserInteracted || !shouldPlayVideo) return;

    try {
      setHasUserInteracted(true);
      await videoElement.play();
    } catch (error) {
      console.warn("Video autoplay failed:", error);
    }
  };


  const handleVideoEnded = () => {
    // Video ends naturally without looping
  };

  return (
    <VideoContext.Provider
      value={{
        videoRef,
        handleVideoEnded,
        introSrc,
        isLoading,
        startVideo,
        hasUserInteracted,
        shouldPlayVideo,
        setCurrentPage,
        shouldShowLayout,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
