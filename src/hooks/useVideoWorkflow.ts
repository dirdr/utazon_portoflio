import { isMobile } from "../utils/mobileDetection";
import { useDesktopVideoWorkflow, DesktopVideoResult } from "./useDesktopVideoWorkflow";
import { useMobileVideoSequence, MobileVideoResult } from "./useMobileVideoSequence";

export interface VideoWorkflowResult {
  videoSrc: string;
  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;
  isLoading: boolean;
  onVideoLoaded: () => void;
  onVideoEnded: () => void;
  onDiveInClick: () => void;
}

export const useVideoWorkflow = (getVideoElement: () => HTMLVideoElement | null, videoBackgroundRef?: React.RefObject<any>): VideoWorkflowResult => {
  const isMobileDetected = isMobile();
  
  const desktopResult = useDesktopVideoWorkflow(isMobileDetected ? () => null : getVideoElement, videoBackgroundRef);
  const mobileResult = useMobileVideoSequence(isMobileDetected ? getVideoElement : () => null, videoBackgroundRef);

  if (isMobileDetected) {
    return {
      videoSrc: mobileResult.videoSrc,
      shouldShowContent: mobileResult.shouldShowContent,
      shouldShowDiveIn: mobileResult.shouldShowDiveIn,
      isLoading: mobileResult.isLoading,
      onVideoLoaded: mobileResult.onVideoLoaded,
      onVideoEnded: mobileResult.onVideoEnded,
      onDiveInClick: mobileResult.onDiveInClick
    };
  } else {
    return {
      videoSrc: desktopResult.videoSrc,
      shouldShowContent: desktopResult.shouldShowContent,
      shouldShowDiveIn: desktopResult.shouldShowDiveIn,
      isLoading: desktopResult.isLoading,
      onVideoLoaded: desktopResult.onVideoLoaded,
      onVideoEnded: desktopResult.onVideoEnded,
      onDiveInClick: desktopResult.onDiveInClick
    };
  }
};
