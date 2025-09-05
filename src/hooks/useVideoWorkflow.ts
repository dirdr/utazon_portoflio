import { useState, useEffect, useCallback, useRef } from 'react';
import { useTransitionContext } from './useTransitionContext';
import { isDiveInCompleted, markDiveInCompleted } from '../utils/diveInStorage';

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
  
  const log = useCallback((message: string, data?: Record<string, unknown>) => {
    console.log(`[VideoWorkflow] ${message}`, data || '');
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
  const shouldShowDiveIn = workflowState === 'ready' && !isMobile && !isDiveInCompleted();
  
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
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    
    log('📹 Video loaded callback triggered', { 
      timestamp, 
      hasVideo: !!video, 
      isHomePage,
      videoSrc: video?.src,
      readyState: video?.readyState,
      currentTime: video?.currentTime 
    });
    
    setIsVideoLoaded(true);
    
    if (!video || !isHomePage) return;

    // Smart transition handling: prevent operations when transitioning AWAY from home,
    // but ALLOW operations when transitioning TO home (for asset preparation)
    const shouldAllowDuringTransition = !isFreshLoad; // SPA navigation to home
    if (isTransitioning && !shouldAllowDuringTransition) {
      log('🛡️ Skipping video setup - fresh load transition in progress', { timestamp });
      return;
    }
    
    if (isTransitioning && shouldAllowDuringTransition) {
      log('🎬 Video setup during SPA transition to home - preparing for smooth transition', { 
        timestamp, 
        isTransitioning, 
        isFreshLoad 
      });
    }
    
    // Don't override current workflow if already in progress
    if (workflowState === 'playing-intro' || workflowState === 'content-showing') {
      log('⏭️ Skipping video setup - workflow already in progress', { workflowState, timestamp });
      return;
    }
    
    
    if (isMobile) {
      // Mobile: Start playing immediately from 0s, show content
      log('📱 Mobile: Starting video and showing content', { timestamp });
      video.currentTime = 0;
      video.play().then(() => {
      }).catch(() => {});
      setWorkflowState('content-showing');
    } else if (isFreshLoad) {
      // Desktop fresh load: Show dive-in button, pause at 0s
      log('🖥️ Fresh load: Video ready, showing dive-in button', { timestamp });
      video.currentTime = 0;
      setWorkflowState('ready');
    } else {
      // Desktop SPA: Seek first, then play to avoid playback interruption
      log('🖥️ SPA: Seeking to loop start and playing', { 
        timestamp, 
        isTransitioning, 
        currentTime: video.currentTime,
        targetTime: LOOP_START_DESKTOP 
      });
      
      // Pause video first to ensure clean seek
      video.pause();
      video.currentTime = LOOP_START_DESKTOP;
      
      // Wait for seek to complete before playing
      const handleSeeked = () => {
        video.removeEventListener('seeked', handleSeeked);
        
        log('🎯 SPA: Seek completed, starting playback', { 
          currentTime: video.currentTime,
          isTransitioning 
        });
        
        video.play().then(() => {
          log('✅ HomeContainer video playing successfully', { 
            currentTime: video.currentTime,
            isTransitioning,
            videoSrc: video.src,
            bufferedRanges: video.buffered.length > 0 ? `${video.buffered.start(0).toFixed(2)}-${video.buffered.end(video.buffered.length-1).toFixed(2)}` : 'none'
          });
        }).catch((error) => {
          log('❌ SPA: Video play failed', { error, isTransitioning });
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
    
    // Mark dive-in as completed for this session
    markDiveInCompleted();
    
    video.currentTime = 0;
    video.play().then(() => {
      setWorkflowState('playing-intro');
    }).catch(() => {});
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
    video.play().catch(() => {});
  }, [loopStartTime, getVideoElement, log]);
  
  // 5. Initialize state based on page/navigation type
  useEffect(() => {
    log('🔄 Page/navigation state change', {
      isHomePage,
      isFreshLoad,
      isMobile,
      isVideoLoaded,
      isTransitioning,
      currentWorkflowState: workflowState
    });

    // Early return for any non-home page scenarios during transitions
    if (!isHomePage) {
      if (isTransitioning) {
        log('🚫 Not home page during transition - waiting', { isTransitioning });
        return;
      } else {
        log('📄 Not home page - setting content showing');
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
  }, [isHomePage, isFreshLoad, isMobile, isVideoLoaded, isTransitioning, log, workflowState]);
  
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