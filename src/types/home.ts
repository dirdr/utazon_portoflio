export interface HomeState {
  isInitialLoad: boolean;
  showDiveInButton: boolean;
  showContent: boolean;
  videoStartTime: number;
  isVideoPlaying: boolean;
  isPreloadComplete: boolean;
}

export type HomeAction =
  | { type: 'PRELOAD_COMPLETE' }
  | { type: 'DIVE_IN_CLICKED' }
  | { type: 'VIDEO_STARTED' }
  | { type: 'SHOW_CONTENT' }
  | { type: 'RESET_FOR_SPA_NAVIGATION' }
  | { type: 'SYNC_WITH_APP_LOADING'; payload: {
      isInitialLoad: boolean;
      showDiveInButton: boolean;
      isPreloadComplete: boolean;
      showContent: boolean;
    }};

export interface HomeContextValue {
  state: HomeState;
  dispatch: React.Dispatch<HomeAction>;
  shouldShowDiveIn: boolean;
  shouldStartVideoAt: number;
  shouldSkipAnimations: boolean;
  hideDiveInButton: () => void;
}