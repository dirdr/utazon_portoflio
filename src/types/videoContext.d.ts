import { RefObject } from "react";

export interface VideoContextState {
  videoRef: RefObject<HTMLVideoElement>;
  introSrc: string;
  isLoading: boolean;
  hasUserInteracted: boolean;
  shouldPlayVideo: boolean;
  shouldShowLayout: boolean;
  volume: number;
  isMuted: boolean;
}

export interface VideoContextActions {
  startVideo: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
}

export interface VideoContextProps
  extends VideoContextState,
    VideoContextActions {}
