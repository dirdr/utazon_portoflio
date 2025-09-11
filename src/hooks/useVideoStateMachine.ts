import { useReducer, useEffect, useRef, useCallback } from 'react';
import { 
  videoReducer, 
  createInitialState, 
  shouldShowContent,
  shouldShowDiveIn,
  getVideoConfig,
  VideoStateMachineConfig,
  VideoPhase,
  getStateInfo
} from '../utils/videoStateMachine';
import { debugVideo, debugMobile } from '../utils/videoDebug';

export interface VideoStateMachineResult {
  // Current state
  phase: VideoPhase;
  videoSrc: string;
  currentTime: number;
  
  // UI control flags
  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;
  shouldShowLoader: boolean;
  
  // Video ref (for compatibility)
  videoRef: React.RefObject<HTMLVideoElement>;
  
  // Event handlers
  onVideoLoaded: () => void;
  onVideoEnded: () => void;
  onDiveInClick: () => void;
  onVideoTimeUpdate: (currentTime: number) => void;
  
  // For debugging
  stateInfo: ReturnType<typeof getStateInfo>;
}

export interface VideoStateMachineConfigExtended extends VideoStateMachineConfig {
  getVideoElement?: () => HTMLVideoElement | null;
}

export const useVideoStateMachine = (config: VideoStateMachineConfigExtended): VideoStateMachineResult => {
  const [state, dispatch] = useReducer(videoReducer, createInitialState(config));
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoConfig = getVideoConfig();
  const contentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const playbackStateRef = useRef({ phase: '', isPlaying: false });
  
  debugVideo('Video state machine initialized', {
    config,
    initialState: getStateInfo(state),
    fullState: state,
  });

  // Auto-start the workflow when component mounts (only once)
  useEffect(() => {
    if (state.phase === 'LOADING') {
      debugVideo('Auto-starting video workflow');
      dispatch({ type: 'ASSETS_LOADED' });
    }
  }, []); // Only run once on mount, not when phase changes

  // Handle mobile entry content timing
  useEffect(() => {
    if (state.phase === 'PLAYING_ENTRY' && config.isMobile) {
      const timer = setTimeout(() => {
        debugMobile('Showing content early during entry video');
        dispatch({ type: 'SHOW_CONTENT_EARLY' });
      }, videoConfig.mobile.contentDelay);

      return () => clearTimeout(timer);
    }
  }, [state.phase, config.isMobile, videoConfig.mobile.contentDelay]);

  // Handle desktop content timing - show after 3 seconds from dive-in click
  useEffect(() => {
    const shouldStartTimer = state.phase === 'PLAYING_ENTRY' && !config.isMobile && config.isFreshLoad && !state.desktopContentShown;
    
    debugVideo('Desktop content timer check', {
      phase: state.phase,
      isMobile: config.isMobile,
      isFreshLoad: config.isFreshLoad,
      desktopContentShown: state.desktopContentShown,
      shouldStartTimer,
      timerExists: contentTimerRef.current !== null
    });
    
    // Start timer if conditions are met and timer doesn't already exist
    if (shouldStartTimer && !contentTimerRef.current) {
      debugVideo('Starting desktop 3-second content timer');
      contentTimerRef.current = setTimeout(() => {
        debugVideo('Desktop 3-second delay complete, dispatching SHOW_DESKTOP_CONTENT');
        dispatch({ type: 'SHOW_DESKTOP_CONTENT' });
        contentTimerRef.current = null; // Clear ref after firing
      }, 3000); // 3 seconds
    }
    
    // Clear timer if content is already shown or conditions no longer met (but not on phase change)
    if (state.desktopContentShown && contentTimerRef.current) {
      debugVideo('Desktop content already shown, clearing timer');
      clearTimeout(contentTimerRef.current);
      contentTimerRef.current = null;
    }
  }, [state.phase, config.isMobile, config.isFreshLoad, state.desktopContentShown]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (contentTimerRef.current) {
        clearTimeout(contentTimerRef.current);
        contentTimerRef.current = null;
      }
    };
  }, []);

  // Video event handlers
  const onVideoLoaded = useCallback(() => {
    // Use getVideoElement if provided (for compatibility), otherwise use our ref
    const video = config.getVideoElement ? config.getVideoElement() : videoRef.current;
    if (!video) {
      debugVideo('Video loaded but no video element found');
      return;
    }

    debugVideo('Video loaded', {
      phase: state.phase,
      videoSrc: state.videoSrc,
      currentVideoSrc: video.src,
      readyToPlay: state.phase === 'PLAYING_ANIMATION' || state.phase === 'PLAYING_INTRO',
    });

    // Set video time based on current state
    if (state.currentTime > 0) {
      video.currentTime = state.currentTime;
    }

    // Auto-play based on state (but not during READY_WITH_DIVE_IN)
    if (state.phase === 'PLAYING_ENTRY' || state.phase === 'PLAYING_LOOP') {
      debugVideo('Attempting to play video', { phase: state.phase });
      video.play().then(() => {
        debugVideo('Video play started successfully');
      }).catch(error => {
        debugVideo('Video play failed', error);
      });
    } else if (state.phase === 'READY_WITH_DIVE_IN') {
      debugVideo('Video loaded for dive-in - ready but not playing', { 
        phase: state.phase,
        currentTime: video.currentTime,
        paused: video.paused,
        readyState: video.readyState,
        buffered: video.buffered.length > 0 ? video.buffered.end(0) : 0
      });
      // Make sure video is at start and paused, showing first frame
      video.currentTime = 0;
      video.pause();
      
      // Ensure video is fully loaded for instant playback
      if (video.readyState < 4) {
        debugVideo('Video not fully loaded, preloading for instant dive-in');
        video.preload = 'auto';
        video.load(); // Force load to ensure it's cached
      }
    }
  }, [state.phase, state.currentTime, state.videoSrc, config]);

  const onVideoEnded = useCallback(() => {
    debugVideo('Video ended', { phase: state.phase });

    if (state.phase === 'PLAYING_ENTRY') {
      dispatch({ type: 'ENTRY_ENDED' });
    } else if (state.phase === 'PLAYING_LOOP') {
      dispatch({ type: 'LOOP_ENDED' });
    }
  }, [state.phase]);

  const onDiveInClick = useCallback(() => {
    debugVideo('Dive-in button clicked');
    dispatch({ type: 'DIVE_IN_CLICKED' });
  }, []);

  const onVideoTimeUpdate = useCallback((currentTime: number) => {
    // For looping behavior - check if we need to restart the loop
    if (state.phase === 'PLAYING_LOOP') {
      const video = config.getVideoElement ? config.getVideoElement() : videoRef.current;
      if (video) {
        // If video is near the end (within 0.1 seconds), loop back to start
        const videoDuration = video.duration || 0;
        if (videoDuration > 0 && currentTime >= videoDuration - 0.1) {
          debugVideo(`Loop video near end (${currentTime}s), restarting from 0s`);
          video.currentTime = 0;
          // Don't need to call play() as the video should continue playing
        }
      }
    }
  }, [state.phase, config]);

  // Handle video source updates only
  useEffect(() => {
    const video = config.getVideoElement ? config.getVideoElement() : videoRef.current;
    if (video && state.videoSrc) {
      // Compare normalized URLs to avoid unnecessary reloads
      const currentSrc = video.src ? new URL(video.src).pathname : '';
      const newSrc = state.videoSrc;
      
      if (currentSrc !== newSrc) {
        debugVideo('Updating video source', {
          from: video.src,
          to: state.videoSrc,
          phase: state.phase,
        });
        
        // Reset playback tracking when source changes
        playbackStateRef.current = { phase: '', isPlaying: false };
        
        // Set preload and update source
        video.preload = 'auto';
        video.src = state.videoSrc;
        video.load();
        
        // Add error handling
        const handleLoadError = () => {
          debugVideo('Video load error', { 
            src: state.videoSrc, 
            error: video.error,
            networkState: video.networkState,
            readyState: video.readyState 
          });
        };
        video.addEventListener('error', handleLoadError, { once: true });
      }
    }
  }, [state.videoSrc, config]);

  // Handle video playback for playing phases  
  useEffect(() => {
    const video = config.getVideoElement ? config.getVideoElement() : videoRef.current;
    
    // Only handle playback for playing phases
    if (video && (state.phase === 'PLAYING_ENTRY' || state.phase === 'PLAYING_LOOP')) {
      const currentPhaseKey = `${state.phase}-${state.currentTime}`;
      
      // Check if we've already started playback for this phase
      if (playbackStateRef.current.phase === currentPhaseKey && playbackStateRef.current.isPlaying) {
        debugVideo('Playback already started for phase, skipping', { 
          phase: state.phase, 
          currentTime: state.currentTime,
          trackedPhase: playbackStateRef.current.phase 
        });
        return;
      }
      
      const startPlayback = () => {
        // Only start if video is actually paused
        if (!video.paused) {
          debugVideo('Video already playing, skipping playback start', { phase: state.phase });
          return;
        }
        
        debugVideo('Starting video playback', { 
          phase: state.phase, 
          currentTime: state.currentTime,
          readyState: video.readyState,
          paused: video.paused
        });
        
        // Mark as playing before starting
        playbackStateRef.current = { phase: currentPhaseKey, isPlaying: true };
        
        video.currentTime = state.currentTime;
        video.play().then(() => {
          debugVideo('Video playback started successfully', { phase: state.phase });
        }).catch(error => {
          debugVideo('Video playback failed', { phase: state.phase, error });
          // Reset on failure
          playbackStateRef.current = { phase: '', isPlaying: false };
        });
      };
      
      // Start playback when video is ready
      if (video.readyState >= 4) {
        startPlayback();
      } else {
        const handleCanPlayThrough = () => {
          startPlayback();
          video.removeEventListener('canplaythrough', handleCanPlayThrough);
        };
        video.addEventListener('canplaythrough', handleCanPlayThrough);
        
        return () => {
          video.removeEventListener('canplaythrough', handleCanPlayThrough);
        };
      }
    }
    
    // Reset playback tracking when leaving playing phases
    if (state.phase !== 'PLAYING_ENTRY' && state.phase !== 'PLAYING_LOOP') {
      playbackStateRef.current = { phase: '', isPlaying: false };
    }
  }, [state.phase, state.currentTime, config]);

  // Update video time when state changes
  useEffect(() => {
    const video = config.getVideoElement ? config.getVideoElement() : videoRef.current;
    if (video && state.currentTime !== video.currentTime) {
      // Only update time if we're not in the middle of playing
      // to avoid interrupting smooth playback
      if (Math.abs(state.currentTime - video.currentTime) > 0.5) {
        debugVideo('Updating video time', {
          from: video.currentTime,
          to: state.currentTime,
          phase: state.phase,
        });
        
        video.currentTime = state.currentTime;
      }
    }
  }, [state.currentTime, state.phase, config]);
  
  // Handle looping in a separate effect
  useEffect(() => {
    if (state.phase === 'PLAYING_LOOP') {
      const video = config.getVideoElement ? config.getVideoElement() : videoRef.current;
      if (video) {
        debugVideo('Setting up loop behavior', {
          currentTime: video.currentTime,
          loopStartTime: state.currentTime,
          duration: video.duration,
        });
        
        // Ensure video starts at loop time and continues playing
        if (video.paused) {
          video.currentTime = state.currentTime;
          video.play().catch(error => {
            debugVideo('Failed to start loop playback', error);
          });
        }
      }
    }
  }, [state.phase, state.currentTime, config]);

  return {
    // Current state
    phase: state.phase,
    videoSrc: state.videoSrc,
    currentTime: state.currentTime,
    
    // UI control flags - use helper functions for consistency
    shouldShowContent: shouldShowContent(state),
    shouldShowDiveIn: shouldShowDiveIn(state),
    shouldShowLoader: state.phase === 'LOADING',
    
    // Video ref
    videoRef,
    
    // Event handlers
    onVideoLoaded,
    onVideoEnded,
    onDiveInClick,
    onVideoTimeUpdate,
    
    // Debug info
    stateInfo: getStateInfo(state),
  };
};