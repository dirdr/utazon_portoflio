import { createContext, useState, ReactNode, useEffect } from "react";
import { VideoContextProps } from "../types/videoContext";
import { useRouteBasedVideo } from "../hooks/useRouteBasedVideo";

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const [shouldShowLayout, setShouldShowLayout] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const { currentPath } = useRouteBasedVideo();

  useEffect(() => {
    setShouldShowLayout(false);
  }, [currentPath]);

  const value: VideoContextProps = {
    shouldShowLayout,
    setShouldShowLayout,
    volume,
    isMuted,
    setVolume,
    toggleMute: () => setIsMuted((prev) => !prev),
    setMuted: setIsMuted,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export { VideoContext };
export default VideoProvider;
