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
    /** Duration of the mobile animation video in seconds */
    animationDuration: number;
    /** Start time for looping intro_mobile.mp4 */
    introLoopStart: number;
    /** Whether to enable the mobile animation sequence */
    enableAnimation: boolean;
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
    muted: true,
    animationDuration: 2.5,
    introLoopStart: 0,
    enableAnimation: true,
  },

  general: {
    debug: true,
  },
};

export const getVideoTransitionConfig = (): VideoTransitionConfig => {
  return DEFAULT_VIDEO_TRANSITION_CONFIG;
};

export const debugVideoTransition = (_message?: string, _data?: unknown) => {
  return;
};
