import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface VideoContextProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  handleVideoEnded: () => void;
  introSrc: string;
  isLoading: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  startVideo: () => void;
  hasUserInteracted: boolean;
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
  const [isMuted, setIsMuted] = useState(true); // Start muted for autoplay compliance
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const introSrc = "/videos/intro.webm";

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleIntroCanPlay = async () => {
      setIsLoading(false);
      try {
        await videoElement.play();
        setHasUserInteracted(true);
      } catch (error) {
        console.warn("Video autoplay failed:", error);
      }
    };

    videoElement.src = introSrc;
    videoElement.addEventListener("canplaythrough", handleIntroCanPlay, {
      once: true,
    });

    return () => {
      videoElement.removeEventListener("canplaythrough", handleIntroCanPlay);
    };
  }, [introSrc]);

  // Global click handler to enable sound after user interaction
  useEffect(() => {
    const enableSoundOnInteraction = () => {
      const videoElement = videoRef.current;
      if (!videoElement || !isMuted) return;

      setIsMuted(false);
      videoElement.muted = false;
      
      // Remove listener after first interaction
      document.removeEventListener('click', enableSoundOnInteraction);
      document.removeEventListener('keydown', enableSoundOnInteraction);
    };

    // Listen for any user interaction
    document.addEventListener('click', enableSoundOnInteraction);
    document.addEventListener('keydown', enableSoundOnInteraction);

    return () => {
      document.removeEventListener('click', enableSoundOnInteraction);
      document.removeEventListener('keydown', enableSoundOnInteraction);
    };
  }, [isMuted]);

  const startVideo = async () => {
    const videoElement = videoRef.current;
    if (!videoElement || hasUserInteracted) return;

    try {
      setHasUserInteracted(true);
      await videoElement.play();
    } catch (error) {
      console.warn("Video autoplay failed:", error);
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    videoElement.muted = newMutedState;
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
        isMuted,
        toggleMute,
        startVideo,
        hasUserInteracted,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
