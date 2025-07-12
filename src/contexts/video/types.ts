export interface VideoContextState {
  videoRef: React.RefObject<HTMLVideoElement>;
  introSrc: string;
  isLoading: boolean;
  hasUserInteracted: boolean;
  shouldPlayVideo: boolean;
  shouldShowLayout: boolean;
  currentPage: string;
}

export interface VideoContextActions {
  startVideo: () => void;
  setCurrentPage: (page: string) => void;
}

export interface VideoContextProps extends VideoContextState, VideoContextActions {}