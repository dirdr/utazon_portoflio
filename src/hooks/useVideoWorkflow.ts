import { useState, useEffect, useCallback, useRef } from 'react';

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

const LOOP_START_DESKTOP = 3; // Desktop loops from 3s
const LOOP_START_MOBILE = 0;  // Mobile loops from 0s
const INTRO_DURATION = 3;     // Intro plays for 3s before content shows

/**
 * Simple, correct video workflow state machine
 * Matches exact user requirements without infinite loops
 */
export const useVideoWorkflow = (config: VideoWorkflowConfig): VideoWorkflowResult => {
  const { isFreshLoad, isMobile, isHomePage, videoSrc, getVideoElement } = config;
  
  // Logging helper
  const log = useCallback((message: string, data?: Record<string, unknown>) => {
    const prefix = '🎬 VideoWorkflow';
    if (data) {
      console.log(`${prefix}: ${message}`, data);
    } else {
      console.log(`${prefix}: ${message}`);
    }
  }, []);
  
  // Core state
  const [workflowState, setWorkflowState] = useState<VideoWorkflowState>('loading');
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);
  
  // Video control
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopStartTime = isMobile ? LOOP_START_MOBILE : LOOP_START_DESKTOP;
  
  // Computed state - FIXED LOGIC FOR IMMEDIATE SPA CONTENT
  const shouldShowContent = 
    isMobile ||                                    // Mobile: always show content
    !isFreshLoad ||                               // SPA: show content immediately  
    workflowState === 'content-showing' ||        // Fresh load: after intro completes
    workflowState === 'spa-playing';              // SPA: confirmed playing
  const shouldShowDiveIn = workflowState === 'ready' && !isMobile;
  
  // Log initial config (only on mount to prevent spam)
  useEffect(() => {
    log('🚀 Initializing video workflow', {
      isFreshLoad,
      isMobile,
      isHomePage,
      videoSrc
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount
  
  // 1. Handle video loading
  const onVideoLoaded = useCallback(() => {
    log('📹 Video loaded successfully');
    setIsVideoLoaded(true);
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video || !isHomePage) return;
    
    if (isMobile) {
      // Mobile: Start playing immediately from 0s, show content
      log('📱 Mobile: Starting video and showing content');
      video.currentTime = 0;
      video.play().catch(console.error);
      setWorkflowState('content-showing');
    } else if (isFreshLoad) {
      // Desktop fresh load: Show dive-in button, pause at 0s
      log('🖥️ Fresh load: Video ready, showing dive-in button');
      video.currentTime = 0;
      setWorkflowState('ready');
    } else {
      // Desktop SPA: Jump to 8s, play immediately, show content
      log('🖥️ SPA: Jumping to 8s and showing content');
      video.currentTime = LOOP_START_DESKTOP;
      video.play().catch(console.error);
      setWorkflowState('spa-playing');
    }
  }, [isHomePage, isFreshLoad, isMobile, getVideoElement, log]);
  
  // 2. Handle dive-in click (only for desktop fresh load)
  const onDiveInClick = useCallback(() => {
    log('🎯 Dive-in clicked, starting video');
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video || workflowState !== 'ready') return;
    
    // Start playing from beginning
    video.currentTime = 0;
    video.play().then(() => {
      setWorkflowState('playing-intro');
    }).catch(console.error);
  }, [workflowState, getVideoElement, log]);
  
  // 3. Handle video time updates (only for intro completion)
  const onVideoTimeUpdate = useCallback((currentTime: number) => {
    // Only care about intro completion on fresh load
    if (workflowState === 'playing-intro' && currentTime >= INTRO_DURATION && !hasCompletedIntro) {
      log(`⏰ Intro completed at ${currentTime.toFixed(2)}s, showing content`);
      setHasCompletedIntro(true);
      setWorkflowState('content-showing');
    }
  }, [workflowState, hasCompletedIntro, log]);
  
  // 4. Handle video ending (for looping)
  const onVideoEnded = useCallback(() => {
    log('🔚 Video ended, looping to start time', { loopStartTime });
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;
    
    // Reset to loop start time and continue playing
    video.currentTime = loopStartTime;
    video.play().catch(console.error);
  }, [loopStartTime, getVideoElement, log]);
  
  // 5. Initialize state based on page/navigation type
  useEffect(() => {
    if (!isHomePage) {
      setWorkflowState('content-showing');
      return;
    }
    
    // Reset for navigation changes
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
  }, [isHomePage, isFreshLoad, isMobile, isVideoLoaded]);
  
  // 6. Preload video when needed (with guards to prevent infinite loops)
  useEffect(() => {
    if (!isHomePage || !videoSrc) return;
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;
    
    // Only reload if video source actually changed or video not loaded
    if (video.src.endsWith(videoSrc) && isVideoLoaded) {
      log('⏭️ Skipping video preload - already loaded', { videoSrc, currentSrc: video.src });
      return;
    }
    
    log('📺 Preloading video', { videoSrc, currentSrc: video.src, isVideoLoaded });
    setIsVideoLoaded(false);
    video.load();
  }, [isHomePage, videoSrc, getVideoElement, isVideoLoaded, log]);
  
  // Log state changes (only on core state changes to prevent cascading)
  useEffect(() => {
    log('📊 State update', {
      workflowState,
      shouldShowContent,
      shouldShowDiveIn,
      isVideoLoaded,
      hasCompletedIntro
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowState, isVideoLoaded, log]); // Only trigger on core state changes
  
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