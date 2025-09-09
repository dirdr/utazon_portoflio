import { useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useAppLoading } from "../../contexts/AppLoadingContext";
import { VideoBackground, VideoBackgroundRef } from "../layout/VideoBackground";
import { DiveInButton } from "../common/DiveInButton";
import { HomeFadeInContainer } from "../common/HomeFadeInContainer";
import { Navbar } from "../layout/Navbar";
import { Home } from "./Home";
import { useHomeMobileBreakpoint } from "../../hooks/useHomeMobileBreakpoint";
import { useCursorTrail } from "../../hooks/useCursorTrail";
import { useVideoWorkflow } from "../../hooks/useVideoWorkflow";
import { useSoundStore } from "../../stores/soundStore";

export const HomeContainer = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isMobile = useHomeMobileBreakpoint();

  const { isFreshLoad } = useAppLoading();
  const { setTrailEnabled } = useCursorTrail();
  const videoBackgroundRef = useRef<VideoBackgroundRef>(null);

  const { setVideoElement, updateForNavigation } = useSoundStore();


  const videoSrc = useMemo(
    () => (isMobile ? "/videos/intro_mobile.mp4" : "/videos/intro.mp4"),
    [isMobile],
  );

  const getVideoElement = useCallback(() => {
    return videoBackgroundRef.current?.video || null;
  }, []);

  const videoWorkflow = useVideoWorkflow({
    isFreshLoad,
    isMobile,
    isHomePage,
    videoSrc,
    getVideoElement,
  });

  useEffect(() => {
    if (videoWorkflow.isVideoLoaded) {
      const video = getVideoElement();
      setVideoElement(video);
    }
  }, [videoWorkflow.isVideoLoaded, getVideoElement, setVideoElement]);

  useEffect(() => {
    if (isHomePage) {
      updateForNavigation(isMobile, isFreshLoad);
    }
  }, [isHomePage, isMobile, isFreshLoad, updateForNavigation]);

  useEffect(() => {
    const shouldEnable =
      (videoWorkflow.shouldShowDiveIn || videoWorkflow.shouldShowContent) &&
      !isMobile;
    setTrailEnabled(shouldEnable);
  }, [
    videoWorkflow.shouldShowDiveIn,
    videoWorkflow.shouldShowContent,
    isMobile,
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
        src={videoSrc}
        showGradient={videoWorkflow.shouldShowContent}
        gradientDelay={isFreshLoad ? 300 : 0}
        onLoadedData={videoWorkflow.onVideoLoaded}
        onTimeUpdate={(e) =>
          videoWorkflow.onVideoTimeUpdate(e.currentTarget.currentTime)
        }
        onEnded={videoWorkflow.onVideoEnded}
      />

      <AnimatePresence>
        {videoWorkflow.shouldShowDiveIn && (
          <DiveInButton
            onDiveIn={handleDiveIn}
            isReady={videoWorkflow.isVideoLoaded}
          />
        )}
      </AnimatePresence>

      {isMobile ? (
        <div className="h-screen relative z-10">
          <Navbar />
          <main className="absolute inset-0 top-auto overflow-hidden">
            <Home />
          </main>
        </div>
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
