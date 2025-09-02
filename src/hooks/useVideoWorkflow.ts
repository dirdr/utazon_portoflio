import { useState, useEffect, useCallback, useRef } from 'react';
import { useTransitionContext } from '../contexts/TransitionContext';

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
  const { isTransitioning } = useTransitionContext();
  
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
  
  // Computed state
  const shouldShowContent = 
    isMobile ||                                    // Mobile: always show content
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
  
  const onVideoLoaded = useCallback(() => {
    const timestamp = Date.now();
    log('📹 Video loaded successfully', { timestamp });
    setIsVideoLoaded(true);
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video || !isHomePage) return;

    // Don't do any video operations during transitions
    if (isTransitioning) {
      log('🛡️ Skipping video setup - transition in progress', { timestamp });
      return;
    }
    
    // Don't override current workflow if already in progress
    if (workflowState === 'playing-intro' || workflowState === 'content-showing') {
      log('⏭️ Skipping video setup - workflow already in progress', { workflowState, timestamp });
      return;
    }
    
    console.log('🎯 VideoWorkflow: About to handle loaded video', {
      isMobile,
      isFreshLoad,
      readyState: video.readyState,
      paused: video.paused,
      currentTime: video.currentTime,
      workflowState,
      timestamp
    });
    
    if (isMobile) {
      // Mobile: Start playing immediately from 0s, show content
      log('📱 Mobile: Starting video and showing content', { timestamp });
      video.currentTime = 0;
      video.play().then(() => {
        console.log('✅ VideoWorkflow: Mobile video play() resolved', { timestamp: Date.now() });
      }).catch(console.error);
      setWorkflowState('content-showing');
    } else if (isFreshLoad) {
      // Desktop fresh load: Show dive-in button, pause at 0s
      log('🖥️ Fresh load: Video ready, showing dive-in button', { timestamp });
      video.currentTime = 0;
      setWorkflowState('ready');
    } else {
      // Desktop SPA: Seek first, then play to avoid playback interruption
      log('🖥️ SPA: Seeking to loop start and playing', { timestamp });
      console.log('⏰ VideoWorkflow: Setting currentTime to', LOOP_START_DESKTOP, { timestamp });
      
      // Pause video first to ensure clean seek
      video.pause();
      video.currentTime = LOOP_START_DESKTOP;
      
      // Wait for seek to complete before playing
      const handleSeeked = () => {
        video.removeEventListener('seeked', handleSeeked);
        console.log('🎬 VideoWorkflow: Seek completed, starting playback', { 
          currentTime: video.currentTime,
          timestamp: Date.now() 
        });
        
        video.play().then(() => {
          console.log('✅ VideoWorkflow: SPA video play() resolved', { 
            currentTime: video.currentTime,
            paused: video.paused,
            timestamp: Date.now() 
          });
        }).catch((error) => {
          console.error('❌ VideoWorkflow: SPA video play() failed', error, { timestamp: Date.now() });
        });
      };
      
      video.addEventListener('seeked', handleSeeked);
      setWorkflowState('spa-playing');
    }
  }, [isHomePage, isFreshLoad, isMobile, getVideoElement, workflowState, isTransitioning, log]);
  
  const onDiveInClick = useCallback(() => {
    log('🎯 Dive-in clicked, starting video');
    
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video || workflowState !== 'ready') return;
    
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
    console.log('🎬 VideoWorkflow: Navigation effect triggered', { 
      isHomePage, 
      isTransitioning,
      willChangeState: !isHomePage && !isTransitioning
    });

    // Early return for any non-home page scenarios during transitions
    if (!isHomePage) {
      if (isTransitioning) {
        console.log('🛡️ VideoWorkflow: Prevented ALL operations during transition');
        return;
      } else {
        console.log('📺 VideoWorkflow: Changing to content-showing (off home page)');
        setWorkflowState('content-showing');
        return;
      }
    }
    
    // Only execute the rest if we're on the home page
    console.log('🏠 VideoWorkflow: Processing home page logic');
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