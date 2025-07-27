import { createContext, useState, ReactNode, useEffect } from "react";
import { VideoContextProps } from "../types/videoContext";
import { useRouteBasedVideo } from "../hooks/useRouteBasedVideo";

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const { currentPath } = useRouteBasedVideo();
  const isHomePage = currentPath === "/";

  const shouldShowLayoutFromRoute = !isHomePage;
  const [shouldShowLayoutOverride, setShouldShowLayoutOverride] = useState<
    boolean | null
  >(null);

  const shouldShowLayout =
    shouldShowLayoutOverride !== null
      ? shouldShowLayoutOverride
      : shouldShowLayoutFromRoute;

  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  console.log("🎬 VideoContext render:", {
    currentPath,
    isHomePage,
    shouldShowLayoutFromRoute,
    shouldShowLayoutOverride,
    finalShouldShowLayout: shouldShowLayout,
  });

  useEffect(() => {
    setShouldShowLayoutOverride(null);
  }, [currentPath]);

  const value: VideoContextProps = {
    shouldShowLayout,
    setShouldShowLayout: setShouldShowLayoutOverride,
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
