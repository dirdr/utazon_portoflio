import { useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAppLoading } from "../../contexts/AppLoadingContext";
import { VideoBackground, VideoBackgroundRef } from "../layout/VideoBackground";
import { DiveInButton } from "../common/DiveInButton";
import { HomeFadeInContainer } from "../common/HomeFadeInContainer";
import { Navbar } from "../layout/Navbar";
import { Home } from "./Home";
import { isMobile } from "../../utils/mobileDetection";
import { useCursorTrail } from "../../hooks/useCursorTrail";
import { useVideoWorkflow } from "../../hooks/useVideoWorkflow";
import { useVideoStateMachine } from "../../hooks/useVideoStateMachine";
import { useSoundStore } from "../../stores/soundStore";
import { debugVideo } from "../../utils/videoDebug";

export const HomeContainer = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isMobileDetected = isMobile();

  const { isFreshLoad } = useAppLoading();

  // FEATURE FLAG: Set to true to use new state machine, false for old system
  const USE_NEW_STATE_MACHINE = true;
  const { setTrailEnabled } = useCursorTrail();
  const videoBackgroundRef = useRef<VideoBackgroundRef>(null);

  const { setVideoElement, updateForNavigation } = useSoundStore();


  const videoSrc = useMemo(
    () => (isMobileDetected ? undefined : "/videos/intro.mp4"), // Mobile uses sequence, desktop uses single video
    [isMobileDetected],
  );

  const getVideoElement = useCallback(() => {
    return videoBackgroundRef.current?.video || null;
  }, []);

  // OLD SYSTEM - for comparison
  const videoWorkflow = useVideoWorkflow({
    isFreshLoad,
    isHomePage,
    videoSrc,
    getVideoElement,
  });

  // NEW STATE MACHINE - testing alongside old system
  const videoStateMachine = useVideoStateMachine({
    isFreshLoad,
    isHomePage,
    isMobile: isMobileDetected,
    getVideoElement, // For compatibility with VideoBackground
  });

  // Debug comparison between old and new systems
  useEffect(() => {
    debugVideo('System Comparison', {
      old: {
        workflowState: videoWorkflow.workflowState,
        shouldShowContent: videoWorkflow.shouldShowContent,
        shouldShowDiveIn: videoWorkflow.shouldShowDiveIn,
        currentVideoSrc: videoWorkflow.currentVideoSrc,
        isVideoLoaded: videoWorkflow.isVideoLoaded,
      },
      new: {
        phase: videoStateMachine.phase,
        shouldShowContent: videoStateMachine.shouldShowContent,
        shouldShowDiveIn: videoStateMachine.shouldShowDiveIn,
        videoSrc: videoStateMachine.videoSrc,
        shouldShowLoader: videoStateMachine.shouldShowLoader,
      }
    });
  }, [
    videoWorkflow.workflowState,
    videoWorkflow.shouldShowContent,
    videoWorkflow.shouldShowDiveIn,
    videoStateMachine.phase,
    videoStateMachine.shouldShowContent,
    videoStateMachine.shouldShowDiveIn,
  ]);

  useEffect(() => {
    if (videoWorkflow.isVideoLoaded) {
      const video = getVideoElement();
      setVideoElement(video);
    }
  }, [videoWorkflow.isVideoLoaded, getVideoElement, setVideoElement]);

  useEffect(() => {
    if (isHomePage) {
      updateForNavigation(isMobileDetected, isFreshLoad);
    }
  }, [isHomePage, isMobileDetected, isFreshLoad, updateForNavigation]);

  // Choose which system to use for cursor trail
  const currentSystem = USE_NEW_STATE_MACHINE ? videoStateMachine : videoWorkflow;
  
  useEffect(() => {
    const shouldEnable =
      (currentSystem.shouldShowDiveIn || currentSystem.shouldShowContent) &&
      !isMobileDetected;
    setTrailEnabled(shouldEnable);
  }, [
    currentSystem.shouldShowDiveIn,
    currentSystem.shouldShowContent,
    isMobileDetected,
    setTrailEnabled,
  ]);

  const handleDiveIn = useCallback(() => {
    if (USE_NEW_STATE_MACHINE) {
      videoStateMachine.onDiveInClick();
    } else {
      videoWorkflow.onDiveInClick();
    }
  }, [USE_NEW_STATE_MACHINE, videoStateMachine, videoWorkflow]);


  if (!isHomePage) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <VideoBackground
        ref={videoBackgroundRef}
        src={USE_NEW_STATE_MACHINE 
          ? videoStateMachine.videoSrc 
          : (videoWorkflow.currentVideoSrc || videoSrc)
        }
        showGradient={USE_NEW_STATE_MACHINE 
          ? videoStateMachine.shouldShowContent 
          : videoWorkflow.shouldShowContent
        }
        gradientDelay={isFreshLoad ? 300 : 0}
        onLoadedData={USE_NEW_STATE_MACHINE 
          ? videoStateMachine.onVideoLoaded 
          : videoWorkflow.onVideoLoaded
        }
        onTimeUpdate={(e) =>
          USE_NEW_STATE_MACHINE
            ? videoStateMachine.onVideoTimeUpdate(e.currentTarget.currentTime)
            : videoWorkflow.onVideoTimeUpdate(e.currentTarget.currentTime)
        }
        onEnded={USE_NEW_STATE_MACHINE 
          ? videoStateMachine.onVideoEnded 
          : videoWorkflow.onVideoEnded
        }
      />

      <AnimatePresence>
        {currentSystem.shouldShowDiveIn && (
          <DiveInButton
            onDiveIn={handleDiveIn}
            isReady={USE_NEW_STATE_MACHINE 
              ? !videoStateMachine.shouldShowLoader 
              : videoWorkflow.isVideoLoaded
            }
          />
        )}
      </AnimatePresence>

      {isMobileDetected ? (
        <HomeFadeInContainer
          isVisible={currentSystem.shouldShowContent}
          className="h-screen relative z-10"
          delay={isFreshLoad ? 50 : 0}
          instantForSPA={!isFreshLoad}
          transitionDuration={400}
        >
          <Navbar />
          <main className="absolute inset-0 top-auto overflow-hidden">
            <Home />
          </main>
        </HomeFadeInContainer>
      ) : (
        <HomeFadeInContainer
          isVisible={currentSystem.shouldShowContent}
          className="h-screen relative z-10"
          delay={isFreshLoad ? 300 : 0}
          instantForSPA={!isFreshLoad}
        >
          <Navbar />
          <main className="absolute inset-0 top-auto overflow-hidden">
            <Home />
          </main>
        </HomeFadeInContainer>
      )}
    </div>
  );
};
