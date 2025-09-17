import { create } from 'zustand';
import { getVideoTransitionConfig } from '../config/videoTransitionConfig';

export type MuteSource = 'navigation' | 'user';

interface SoundState {
  isSoundPlaying: boolean;
  muteSource: MuteSource;
  videoElement: HTMLVideoElement | null;
}

interface SoundActions {
  setVideoElement: (video: HTMLVideoElement | null) => void;
  toggleSound: () => void;
  updateForNavigation: (isMobile: boolean, isFreshLoad: boolean) => void;
}

export const useSoundStore = create<SoundState & SoundActions>((set, get) => ({
  isSoundPlaying: true,
  muteSource: 'navigation',
  videoElement: null,

  setVideoElement: (video) => {
    const { isSoundPlaying } = get();
    set({ videoElement: video });
    if (video) {
      video.muted = !isSoundPlaying;
    }
  },

  toggleSound: (newState?: boolean) => {
    const { videoElement } = get();
    set(state => {
      const newIsSoundPlaying = newState !== undefined ? newState : !state.isSoundPlaying;
      if (videoElement) {
        videoElement.muted = !newIsSoundPlaying;
      }
      return {
        isSoundPlaying: newIsSoundPlaying,
        muteSource: 'user'
      };
    });
  },

  updateForNavigation: (isMobile, isFreshLoad) => {
    const { videoElement, muteSource } = get();
    
    if (muteSource === 'user') {
      return;
    }

    const config = getVideoTransitionConfig();
    let navigationSoundState: boolean;

    if (isMobile) {
      navigationSoundState = !config.mobile.muted;
    } else if (!isFreshLoad) {
      navigationSoundState = config.spa.withSound;
    } else {
      navigationSoundState = true;
    }


    set({ 
      isSoundPlaying: navigationSoundState,
      muteSource: 'navigation'
    });

    if (videoElement) {
      videoElement.muted = !navigationSoundState;
    }
  }
}));