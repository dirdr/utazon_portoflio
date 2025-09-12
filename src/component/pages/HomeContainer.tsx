import { useCallback, useEffect, useRef } from "react";
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
import { useSoundStore } from "../../stores/soundStore";

export const HomeContainer = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isMobileDetected = isMobile();

  const { isFreshLoad } = useAppLoading();

  const { setTrailEnabled } = useCursorTrail();
  const videoBackgroundRef = useRef<VideoBackgroundRef>(null);
  const { setVideoElement, updateForNavigation } = useSoundStore();

  const getVideoElement = useCallback(() => {
    return videoBackgroundRef.current?.video || null;
  }, []);

  
  const videoWorkflow = useVideoWorkflow(getVideoElement, videoBackgroundRef);

  useEffect(() => {
    const video = videoBackgroundRef.current?.video;
    if (video && !videoWorkflow.isLoading) {
      setVideoElement(video);
    }
  }, [videoWorkflow.isLoading, setVideoElement]);

  useEffect(() => {
    if (isHomePage) {
      updateForNavigation(isMobileDetected, isFreshLoad);
    }
  }, [isHomePage, isMobileDetected, isFreshLoad, updateForNavigation]);

  useEffect(() => {
    const shouldEnable =
      (videoWorkflow.shouldShowDiveIn || videoWorkflow.shouldShowContent) &&
      !isMobileDetected;
    setTrailEnabled(shouldEnable);
  }, [
    videoWorkflow.shouldShowDiveIn,
    videoWorkflow.shouldShowContent,
    isMobileDetected,
    setTrailEnabled,
  ]);

  const handleDiveIn = useCallback(() => {
    videoWorkflow.onDiveInClick();
  }, [videoWorkflow]);


  if (!isHomePage) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      <VideoBackground
        ref={videoBackgroundRef}
        src={videoWorkflow.videoSrc}
        showGradient={videoWorkflow.shouldShowContent}
        gradientDelay={isFreshLoad ? 300 : 0}
        onLoadedData={videoWorkflow.onVideoLoaded}
        onEnded={videoWorkflow.onVideoEnded}
      />

      <AnimatePresence>
        {videoWorkflow.shouldShowDiveIn && !isMobileDetected && (
          <DiveInButton
            onDiveIn={handleDiveIn}
            isReady={!videoWorkflow.isLoading}
          />
        )}
      </AnimatePresence>

      {isMobileDetected ? (
        <HomeFadeInContainer
          isVisible={videoWorkflow.shouldShowContent}
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
          isVisible={videoWorkflow.shouldShowContent}
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
