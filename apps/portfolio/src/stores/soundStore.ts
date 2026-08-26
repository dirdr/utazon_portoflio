import { create } from "zustand";
import { getVideoTransitionConfig } from "../config/videoTransitionConfig";

export type MuteSource = "navigation" | "user";

interface SoundState {
  isSoundPlaying: boolean;
  muteSource: MuteSource;
  videoElement: HTMLVideoElement | null;
}

interface SoundActions {
  setVideoElement: (video: HTMLVideoElement | null) => void;
  toggleSound: (newState?: boolean) => void;
  muteForPolicy: () => void;
  updateForNavigation: (isMobile: boolean, isFreshLoad: boolean) => void;
}

export const useSoundStore = create<SoundState & SoundActions>((set, get) => ({
  isSoundPlaying: true,
  muteSource: "navigation",
  videoElement: null,

  setVideoElement: (video) => {
    const { isSoundPlaying } = get();
    set({ videoElement: video });
    if (video) {
      video.muted = !isSoundPlaying;
    }
  },

  /**
   * The browser refused audible playback. Reflect that in the UI so the toggle
   * shows the real state, but keep muteSource as "navigation" so this is not
   * mistaken for a deliberate choice by the visitor.
   */
  muteForPolicy: () => {
    const { videoElement } = get();
    if (videoElement) {
      videoElement.muted = true;
    }
    set({ isSoundPlaying: false, muteSource: "navigation" });
  },

  toggleSound: (newState?: boolean) => {
    const { videoElement } = get();
    set((state) => {
      const newIsSoundPlaying =
        newState !== undefined ? newState : !state.isSoundPlaying;
      if (videoElement) {
        videoElement.muted = !newIsSoundPlaying;
      }
      return {
        isSoundPlaying: newIsSoundPlaying,
        muteSource: "user",
      };
    });
  },

  updateForNavigation: (isMobile, isFreshLoad) => {
    const { videoElement, muteSource } = get();

    if (muteSource === "user") {
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
      muteSource: "navigation",
    });

    if (videoElement) {
      videoElement.muted = !navigationSoundState;
    }
  },
}));
