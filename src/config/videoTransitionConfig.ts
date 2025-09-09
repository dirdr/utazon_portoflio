export interface VideoTransitionConfig {
  spa: {
    jumpToTime: number;
    withSound: boolean;
  };

  fresh: {
    loopStartTime: number;
    mobileLoopStartTime: number;
    introDuration: number;
  };

  mobile: {
    /** Whether mobile videos should be muted by default */
    muted: boolean;
  };

  general: {
    debug: boolean;
  };
}

/**
 * Default Video Transition Configuration
 *
 * You can easily modify these values to change video behavior:
 */
export const DEFAULT_VIDEO_TRANSITION_CONFIG: VideoTransitionConfig = {
  spa: {
    jumpToTime: 10,
    withSound: false,
  },

  fresh: {
    loopStartTime: 3,
    mobileLoopStartTime: 0,
    introDuration: 3,
  },

  mobile: {
    muted: true, // ← Mobile videos are muted by default
  },

  general: {
    debug: true,
  },
};

export const getVideoTransitionConfig = (): VideoTransitionConfig => {
  return DEFAULT_VIDEO_TRANSITION_CONFIG;
};

export const debugVideoTransition = (message: string, data?: unknown) => {
  const config = getVideoTransitionConfig();
  if (config.general.debug) {
    const timestamp = new Date().toISOString().slice(11, 23);
    console.log(`🎥 [VIDEO-TRANSITION ${timestamp}] ${message}`, data || "");
  }
};
