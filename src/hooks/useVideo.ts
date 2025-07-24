import { useContext } from "react";
import { createContext } from "react";
import { VideoContextProps } from "../types/videoContext";

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
