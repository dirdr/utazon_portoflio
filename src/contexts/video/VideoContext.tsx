import { createContext } from "react";
import type { VideoContextProps } from "./types";

export const VideoContext = createContext<VideoContextProps | undefined>(
  undefined,
);