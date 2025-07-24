import {
  createContext,
  useRef,
  useState,
  ReactNode,
} from "react";
import { VideoContextProps } from "../types/videoContext";
import { useVideoPlayer } from "../hooks/useVideoPlayer";
import { useRouteBasedVideo } from "../hooks/useRouteBasedVideo";

const VideoContext = createContext<VideoContextProps | undefined>(undefined);

interface VideoProviderProps {
  children: ReactNode;
}

export const VideoProvider = ({ children }: VideoProviderProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldShowLayout, setShouldShowLayout] = useState(false);

  const introSrc = "/videos/intro.webm";
  const { shouldPlayVideo } = useRouteBasedVideo();
  
  const videoPlayer = useVideoPlayer({
    videoRef,
    shouldPlayVideo,
    introSrc,
    onLayoutShow: () => setShouldShowLayout(true),
  });

  const value: VideoContextProps = {
    videoRef,
    introSrc,
    shouldPlayVideo,
    shouldShowLayout,
    ...videoPlayer,
  };

  return (
    <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
  );
};

export { VideoContext };
export default VideoProvider;

