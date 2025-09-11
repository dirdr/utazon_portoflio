import { isMobile } from "../utils/mobileDetection";
import { useDesktopVideoWorkflow, DesktopVideoWorkflowResult } from "./useDesktopVideoWorkflow";
import { useMobileVideoSequence, MobileVideoSequenceResult } from "./useMobileVideoSequence";

export type VideoWorkflowState =
  | "loading"
  | "ready"
  | "playing-intro"
  | "content-showing"
  | "spa-playing"
  | "playing-mobile-anim"
  | "transitioning"
  | "looping";

export interface VideoWorkflowConfig {
  isFreshLoad: boolean;
  isHomePage: boolean;
  videoSrc?: string; // Optional for mobile (uses sequence)
  getVideoElement?: () => HTMLVideoElement | null;
}

export interface VideoWorkflowResult {
  workflowState: VideoWorkflowState;
  isVideoLoaded: boolean;

  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;

  videoRef: React.RefObject<HTMLVideoElement>;
  loopStartTime: number;

  onVideoLoaded: () => void;
  onVideoEnded: () => void;
  onVideoTimeUpdate: (currentTime: number) => void;
  onDiveInClick: () => void;

  // Mobile-specific properties
  currentVideoSrc?: string;
  currentVideoType?: string;
}

export const useVideoWorkflow = (
  config: VideoWorkflowConfig,
): VideoWorkflowResult => {
  const { isFreshLoad, isHomePage, videoSrc, getVideoElement } = config;
  const isMobileDetected = isMobile();

  // Always call both hooks (rules of hooks requirement)
  const mobileResult: MobileVideoSequenceResult = useMobileVideoSequence({
    isFreshLoad,
    isHomePage,
    getVideoElement,
  });

  const desktopResult: DesktopVideoWorkflowResult = useDesktopVideoWorkflow({
    isFreshLoad,
    isHomePage,
    videoSrc: videoSrc || "/videos/intro.mp4", // Fallback for desktop
    getVideoElement,
  });

  // Return appropriate result based on device type
  if (isMobileDetected) {
    // Map mobile result to unified interface
    return {
      workflowState: mobileResult.sequenceState as VideoWorkflowState,
      isVideoLoaded: mobileResult.isVideoLoaded,
      shouldShowContent: mobileResult.shouldShowContent,
      shouldShowDiveIn: mobileResult.shouldShowDiveIn,
      videoRef: mobileResult.videoRef,
      loopStartTime: mobileResult.loopStartTime,
      onVideoLoaded: mobileResult.onVideoLoaded,
      onVideoEnded: mobileResult.onVideoEnded,
      onVideoTimeUpdate: mobileResult.onVideoTimeUpdate,
      onDiveInClick: mobileResult.onDiveInClick,
      currentVideoSrc: mobileResult.currentVideoSrc,
      currentVideoType: mobileResult.currentVideoType,
    };
  } else {
    // Map desktop result to unified interface
    return {
      workflowState: desktopResult.workflowState as VideoWorkflowState,
      isVideoLoaded: desktopResult.isVideoLoaded,
      shouldShowContent: desktopResult.shouldShowContent,
      shouldShowDiveIn: desktopResult.shouldShowDiveIn,
      videoRef: desktopResult.videoRef,
      loopStartTime: desktopResult.loopStartTime,
      onVideoLoaded: desktopResult.onVideoLoaded,
      onVideoEnded: desktopResult.onVideoEnded,
      onVideoTimeUpdate: desktopResult.onVideoTimeUpdate,
      onDiveInClick: desktopResult.onDiveInClick,
      currentVideoSrc: videoSrc,
    };
  }
};
