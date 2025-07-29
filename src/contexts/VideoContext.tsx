import { createContext, useState, ReactNode, useEffect } from "react";
import { VideoContextProps } from "../types/videoContext";
import { useRouteBasedVideo } from "../hooks/useRouteBasedVideo";
import { useAppState } from "../hooks/useAppState";

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const { currentPath } = useRouteBasedVideo();
  const { isFirstLoad } = useAppState();
  const isHomePage = currentPath === "/";

  // For non-home pages, always show layout
  // For home page: show immediately on SPA navigation, wait for video on fresh load
  const shouldShowLayoutFromRoute = !isHomePage || (isHomePage && !isFirstLoad);
  
  const [shouldShowLayoutOverride, setShouldShowLayoutOverride] = useState<
    boolean | null
  >(null);

  console.log("🎭 VideoProvider logic:", {
    currentPath,
    isHomePage,
    isFirstLoad,
    shouldShowLayoutFromRoute,
    shouldShowLayoutOverride,
    finalShouldShow: shouldShowLayoutOverride !== null ? shouldShowLayoutOverride : shouldShowLayoutFromRoute
  });

  const shouldShowLayout =
    shouldShowLayoutOverride !== null
      ? shouldShowLayoutOverride
      : shouldShowLayoutFromRoute;

  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);


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
