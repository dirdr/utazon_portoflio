import { debugVideo, debugVideoError, debugVideoSuccess } from './videoDebug';

// State Machine Types
export type VideoPhase = 
  | 'LOADING'
  | 'READY_WITH_DIVE_IN' 
  | 'PLAYING_ENTRY'  // Renamed from PLAYING_ANIMATION/PLAYING_INTRO
  | 'PLAYING_LOOP'   // Renamed from LOOPING
  | 'LOOPING';

export type VideoAction = 
  | { type: 'ASSETS_LOADED' }
  | { type: 'DIVE_IN_CLICKED' }
  | { type: 'ENTRY_ENDED' }    // Unified name for both mobile and desktop
  | { type: 'LOOP_ENDED' }     // When loop video ends, restart it
  | { type: 'SPA_NAVIGATION' }
  | { type: 'SHOW_CONTENT_EARLY' }
  | { type: 'SHOW_DESKTOP_CONTENT' };

export interface VideoState {
  phase: VideoPhase;
  videoSrc: string;
  currentTime: number;
  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;
  animationContentShown: boolean;
  desktopContentShown: boolean;
  
  // Configuration
  isMobile: boolean;
  isFreshLoad: boolean;
  isHomePage: boolean;
  loopStartTime: number;
}

export interface VideoStateMachineConfig {
  isFreshLoad: boolean;
  isHomePage: boolean;
  isMobile: boolean;
}

// Video configuration helper
export const getVideoConfig = () => ({
  desktop: {
    entrySrc: '/videos/intro/desktop/entry_desktop.mp4',
    loopSrc: '/videos/intro/desktop/loop_desktop.mp4',
    loopStartTime: 0, // Loop video starts from 0
  },
  mobile: {
    entrySrc: '/videos/intro/mobile/entry_mobile.mp4',
    loopSrc: '/videos/intro/mobile/loop_mobile.mp4',
    loopStartTime: 0,
    contentDelay: 500, // Show content 500ms after animation starts
  }
});

// Helper to get video source based on phase and platform
export const getVideoSrc = (phase: VideoPhase, isMobile: boolean): string => {
  const config = getVideoConfig();
  const platform = isMobile ? config.mobile : config.desktop;
  
  switch (phase) {
    case 'PLAYING_ENTRY':
      return platform.entrySrc;
    case 'PLAYING_LOOP':
    case 'LOOPING':
      return platform.loopSrc;
    case 'READY_WITH_DIVE_IN':
      // Desktop: preload entry video for dive-in, Mobile: N/A
      return !isMobile ? platform.entrySrc : '';
    default:
      return '';
  }
};

// Helper to determine if content should show
export const shouldShowContent = (state: VideoState): boolean => {
  if (state.isMobile) {
    // Mobile: Show content during entry (after delay) or after
    return state.animationContentShown || 
           (state.phase !== 'LOADING' && state.phase !== 'PLAYING_ENTRY');
  } else {
    // Desktop: Show content only after 3-second delay from dive-in click, or during SPA
    if (state.isFreshLoad) {
      return state.desktopContentShown;
    } else {
      // SPA navigation - show immediately
      return state.phase !== 'LOADING' && state.phase !== 'READY_WITH_DIVE_IN';
    }
  }
};

// Helper to determine if dive-in should show
export const shouldShowDiveIn = (state: VideoState): boolean => {
  return state.phase === 'READY_WITH_DIVE_IN' && !state.isMobile && state.isFreshLoad;
};

// Create initial state based on config
export const createInitialState = (config: VideoStateMachineConfig): VideoState => {
  const videoConfig = getVideoConfig();
  
  return {
    phase: 'LOADING',
    videoSrc: '',
    currentTime: 0,
    shouldShowContent: false,
    shouldShowDiveIn: false,
    animationContentShown: false,
    desktopContentShown: false,
    
    // Configuration
    isMobile: config.isMobile,
    isFreshLoad: config.isFreshLoad,
    isHomePage: config.isHomePage,
    loopStartTime: config.isMobile ? videoConfig.mobile.loopStartTime : videoConfig.desktop.loopStartTime,
  };
};

// Main state machine reducer
export const videoReducer = (state: VideoState, action: VideoAction): VideoState => {
  debugVideo(`State transition: ${state.phase} + ${action.type}`, {
    currentState: state.phase,
    action: action.type,
    isMobile: state.isMobile,
    isFreshLoad: state.isFreshLoad,
  });

  switch (action.type) {
    case 'ASSETS_LOADED': {
      if (state.isMobile && state.isFreshLoad) {
        // Mobile fresh load: Start with entry video
        const newState = {
          ...state,
          phase: 'PLAYING_ENTRY' as VideoPhase,
          videoSrc: getVideoSrc('PLAYING_ENTRY', true),
          currentTime: 0,
          shouldShowContent: false, // Will show after delay
          shouldShowDiveIn: false,
        };
        debugVideoSuccess('Mobile: Starting entry video');
        return newState;
      } 
      else if (!state.isMobile && state.isFreshLoad) {
        // Desktop fresh load: Show dive-in button
        const newState = {
          ...state,
          phase: 'READY_WITH_DIVE_IN' as VideoPhase,
          videoSrc: getVideoSrc('READY_WITH_DIVE_IN', false), // Preload entry video
          currentTime: 0, // Start at beginning, ready for dive-in
          shouldShowContent: false,
          shouldShowDiveIn: true,
        };
        debugVideoSuccess('Desktop: Ready for dive-in');
        return newState;
      } 
      else {
        // SPA navigation: Skip directly to loop video for both mobile and desktop
        const newState = {
          ...state,
          phase: 'PLAYING_LOOP' as VideoPhase,
          videoSrc: getVideoSrc('PLAYING_LOOP', state.isMobile),
          currentTime: 0,
          shouldShowContent: true,
          shouldShowDiveIn: false,
        };
        debugVideoSuccess('SPA Navigation: Direct to loop video');
        return newState;
      }
    }

    case 'DIVE_IN_CLICKED': {
      if (state.phase === 'READY_WITH_DIVE_IN') {
        const newState = {
          ...state,
          phase: 'PLAYING_ENTRY' as VideoPhase,
          videoSrc: getVideoSrc('PLAYING_ENTRY', state.isMobile),
          currentTime: 0, // Start from beginning for dive-in
          shouldShowContent: false, // Will be set to true after 3-second delay
          shouldShowDiveIn: false,
        };
        debugVideoSuccess('Dive-in clicked: Starting entry video');
        return newState;
      }
      debugVideoError('DIVE_IN_CLICKED in invalid state', state.phase);
      return state;
    }

    case 'SHOW_CONTENT_EARLY': {
      if (state.phase === 'PLAYING_ENTRY') {
        const newState = {
          ...state,
          animationContentShown: true,
          shouldShowContent: true,
        };
        debugVideo('Mobile: Showing content early during entry video');
        return newState;
      }
      return state;
    }

    case 'SHOW_DESKTOP_CONTENT': {
      debugVideo('SHOW_DESKTOP_CONTENT action received', {
        phase: state.phase,
        isMobile: state.isMobile,
        conditionMet: (state.phase === 'PLAYING_ENTRY' || state.phase === 'PLAYING_LOOP') && !state.isMobile
      });
      
      // Allow showing content in both PLAYING_ENTRY and PLAYING_LOOP phases for desktop
      if ((state.phase === 'PLAYING_ENTRY' || state.phase === 'PLAYING_LOOP') && !state.isMobile) {
        const newState = {
          ...state,
          desktopContentShown: true,
          shouldShowContent: true,
        };
        debugVideoSuccess('Desktop: Content shown after 3-second delay', {
          phase: state.phase,
          oldDesktopContentShown: state.desktopContentShown,
          newDesktopContentShown: newState.desktopContentShown
        });
        return newState;
      }
      debugVideoError('SHOW_DESKTOP_CONTENT action ignored - invalid state', {
        phase: state.phase,
        isMobile: state.isMobile
      });
      return state;
    }

    case 'ENTRY_ENDED': {
      if (state.phase === 'PLAYING_ENTRY') {
        const newState = {
          ...state,
          phase: 'PLAYING_LOOP' as VideoPhase,
          videoSrc: getVideoSrc('PLAYING_LOOP', state.isMobile),
          currentTime: 0,
          shouldShowContent: true,
          animationContentShown: true,
        };
        debugVideoSuccess('Entry ended: Transitioning to loop video');
        return newState;
      }
      debugVideoError('ENTRY_ENDED in invalid state', state.phase);
      return state;
    }

    case 'LOOP_ENDED': {
      if (state.phase === 'PLAYING_LOOP') {
        const newState = {
          ...state,
          currentTime: 0, // Loop video restarts from beginning
        };
        debugVideo('Loop ended: Restarting loop video');
        return newState;
      }
      debugVideoError('LOOP_ENDED in invalid state', state.phase);
      return state;
    }

    default:
      debugVideoError('Unknown action type', action);
      return state;
  }
};

// State machine validation helpers
export const isValidTransition = (currentPhase: VideoPhase, action: VideoAction): boolean => {
  const validTransitions: Record<VideoPhase, VideoAction['type'][]> = {
    'LOADING': ['ASSETS_LOADED'],
    'READY_WITH_DIVE_IN': ['DIVE_IN_CLICKED'],
    'PLAYING_ENTRY': ['ENTRY_ENDED', 'SHOW_CONTENT_EARLY', 'SHOW_DESKTOP_CONTENT'],
    'PLAYING_LOOP': ['LOOP_ENDED'],
    'LOOPING': ['LOOP_ENDED'], // Legacy phase, can be removed later
  };

  return validTransitions[currentPhase]?.includes(action.type) ?? false;
};

// Debug helper to get current state info
export const getStateInfo = (state: VideoState) => ({
  phase: state.phase,
  videoSrc: state.videoSrc,
  currentTime: state.currentTime,
  shouldShowContent: state.shouldShowContent,
  shouldShowDiveIn: state.shouldShowDiveIn,
  platform: state.isMobile ? 'mobile' : 'desktop',
  navigation: state.isFreshLoad ? 'fresh' : 'spa',
});