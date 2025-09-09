import { useState, useEffect, useCallback, useRef } from 'react';
import { useTransitionContext } from './useTransitionContext';
import { isDiveInCompleted, markDiveInCompleted } from '../utils/diveInStorage';
import { getVideoTransitionConfig, debugVideoTransition } from '../config/videoTransitionConfig';

export type VideoWorkflowState = 
  | 'loading'           // Video is loading
  | 'ready'            // Fresh load: show dive-in button, video paused at 0s
  | 'playing-intro'    // Fresh load: playing from 0s after dive-in click
  | 'content-showing'  // Content is visible, video playing/looping
  | 'spa-playing';     // SPA: video playing from 8s, content visible

export interface VideoWorkflowConfig {
  isFreshLoad: boolean;
  isMobile: boolean;
  isHomePage: boolean;
  videoSrc: string;
  getVideoElement?: () => HTMLVideoElement | null;
}

export interface VideoWorkflowResult {
  // State
  workflowState: VideoWorkflowState;
  isVideoLoaded: boolean;
  
  // UI Control
  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;
  
  // Video Control
  videoRef: React.RefObject<HTMLVideoElement>;
  loopStartTime: number;
  
  // Actions
  onVideoLoaded: () => void;
  onVideoEnded: () => void;
  onVideoTimeUpdate: (currentTime: number) => void;
  onDiveInClick: () => void;
}

// Get configuration values
const getVideoConfig = () => {
  const config = getVideoTransitionConfig();
  return {
    LOOP_START_DESKTOP: config.fresh.loopStartTime,        // Desktop loops from config
    LOOP_START_MOBILE: config.fresh.mobileLoopStartTime,   // Mobile loops from config
    INTRO_DURATION: config.fresh.introDuration,            // Intro plays for config duration
    SPA_JUMP_TIME: config.spa.jumpToTime,                  // SPA navigation jump time
    SPA_WITH_SOUND: config.spa.withSound,                  // SPA navigation sound setting
    MOBILE_MUTED: config.mobile.muted,                     // Mobile video muted setting
  };
};

/**
 * Simple, correct video workflow state machine
 * Matches exact user requirements without infinite loops
 */
export const useVideoWorkflow = (config: VideoWorkflowConfig): VideoWorkflowResult => {
  const { isFreshLoad, isMobile, isHomePage, videoSrc, getVideoElement } = config;
  const { isTransitioning } = useTransitionContext();
  
  // Get video configuration
  const videoConfig = getVideoConfig();
  
  // Core state
  const [workflowState, setWorkflowState] = useState<VideoWorkflowState>('loading');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  
  // Video control
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopStartTime = isMobile ? videoConfig.LOOP_START_MOBILE : videoConfig.LOOP_START_DESKTOP;
  
  
  
  // Computed state
  const shouldShowContent = 
    isMobile ||                                    // Mobile: always show content
    workflowState === 'content-showing' ||        // Fresh load: after intro completes
    workflowState === 'spa-playing';              // SPA: confirmed playing
  const shouldShowDiveIn = workflowState === 'ready' && !isMobile && !isDiveInCompleted();
  
  
  
  const onVideoLoaded = useCallback(() => {
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    
    
    setIsVideoLoaded(true);
    
    if (!video || !isHomePage) return;

    // Smart transition handling: prevent operations when transitioning AWAY from home,
    // but ALLOW operations when transitioning TO home (for asset preparation)
    const shouldAllowDuringTransition = !isFreshLoad; // SPA navigation to home
    if (isTransitioning && !shouldAllowDuringTransition) {
      return;
    }
    
    
    // Don't override current workflow if already in progress
    if (workflowState === 'playing-intro' || workflowState === 'content-showing') {
      return;
    }
    
    
    if (isMobile) {
      video.currentTime = 0;
      
      video.play().then(() => {
        debugVideoTransition('Mobile video playback started');
      }).catch(() => {
        debugVideoTransition('Mobile video playback failed');
      });
      setWorkflowState('content-showing');
    } else if (isFreshLoad) {
      // Desktop fresh load: Show dive-in button, pause at 0s
      video.currentTime = 0;
      setWorkflowState('ready');
    } else {
      // Desktop SPA: Seek first, then play to avoid playback interruption
      
      debugVideoTransition('SPA navigation detected, configuring video:', {
        jumpToTime: videoConfig.SPA_JUMP_TIME,
        withSound: videoConfig.SPA_WITH_SOUND,
        currentMuted: video.muted
      });
      
      // Pause video first to ensure clean seek
      video.pause();
      video.currentTime = videoConfig.SPA_JUMP_TIME;
      
      
      // Wait for seek to complete before playing
      const handleSeeked = () => {
        video.removeEventListener('seeked', handleSeeked);
        
        debugVideoTransition(`Starting SPA video playback from ${videoConfig.SPA_JUMP_TIME}s`);
        
        video.play().then(() => {
          debugVideoTransition('SPA video playback started successfully');
        }).catch((error) => {
          debugVideoTransition('SPA video playback failed:', error);
        });
      };
      
      video.addEventListener('seeked', handleSeeked);
      setWorkflowState('spa-playing');
    }
  }, [isHomePage, isFreshLoad, isMobile, getVideoElement, workflowState, isTransitioning]);
  
  const onDiveInClick = useCallback(() => {
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video || workflowState !== 'ready') {
      return;
    }
    
    // Mark dive-in as completed for this session
    markDiveInCompleted();
    
    video.currentTime = 0;
    video.play().then(() => {
      setWorkflowState('playing-intro');
    }).catch(() => {
    });
  }, [workflowState, getVideoElement]);
  
  // 3. Handle video time updates (only for intro completion)
  const onVideoTimeUpdate = useCallback((currentTime: number) => {
    
    // Only care about intro completion on fresh load
    if (workflowState === 'playing-intro' && currentTime >= videoConfig.INTRO_DURATION && !hasCompletedIntro) {
      debugVideoTransition(`Intro completed at ${currentTime}s, showing content`);
      setHasCompletedIntro(true);
      setWorkflowState('content-showing');
    }
  }, [workflowState, hasCompletedIntro, videoConfig.INTRO_DURATION]);
  
  // 4. Handle video ending (for looping)
  const onVideoEnded = useCallback(() => {
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;
    
    // Reset to loop start time and continue playing
    video.currentTime = loopStartTime;
    video.play().catch(() => {});
  }, [loopStartTime, getVideoElement]);
  
  // 5. Initialize state based on page/navigation type
  useEffect(() => {

    // Early return for any non-home page scenarios during transitions
    if (!isHomePage) {
      if (isTransitioning) {
        return;
      } else {
        setWorkflowState('content-showing');
        return;
      }
    }
    
    // Only execute the rest if we're on the home page
    setHasCompletedIntro(false);
    
    if (isVideoLoaded) {
      // Video already loaded, set appropriate state
      if (isMobile) {
        setWorkflowState('content-showing');
      } else if (isFreshLoad) {
        setWorkflowState('ready');
      } else {
        setWorkflowState('spa-playing');
      }
    } else {
      setWorkflowState('loading');
    }
  }, [isHomePage, isFreshLoad, isMobile, isVideoLoaded, isTransitioning]);
  
  // 6. Preload video when needed (with guards to prevent infinite loops)
  useEffect(() => {
    if (!isHomePage || !videoSrc) return;
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;
    
    // Only reload if video source actually changed or video not loaded
    if (video.src.endsWith(videoSrc) && isVideoLoaded) {
      return;
    }
    
    setIsVideoLoaded(false);
    video.load();
  }, [isHomePage, videoSrc, getVideoElement, isVideoLoaded]);
  


  
  return {
    // State
    workflowState,
    isVideoLoaded,
    
    // UI Control
    shouldShowContent,
    shouldShowDiveIn,
    
    // Video Control
    videoRef,
    loopStartTime,
    
    // Actions
    onVideoLoaded,
    onVideoEnded,
    onVideoTimeUpdate,
    onDiveInClick,
  };
};