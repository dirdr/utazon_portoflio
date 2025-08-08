import { useRef, useCallback, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { useAppLoading } from "../../contexts/AppLoadingContext";
import { VideoBackground, VideoBackgroundRef } from "../layout/VideoBackground";
import { DiveInButton } from "../common/DiveInButton";
import { FadeInContainer } from "../common/FadeInContainer";
import { Navbar } from "../layout/Navbar";
import { Home } from "./Home";
import { useIsMobileHome } from "../../hooks/useIsMobileHome";

export const HomeContainer = () => {
  const [location] = useLocation();
  const isHomePage = location === "/";
  const isMobile = useIsMobileHome();
  
  const { 
    showDiveInButton, 
    hideDiveInButton,
    isFreshLoad,
    videoBehavior
  } = useAppLoading();
  
  const videoRef = useRef<VideoBackgroundRef>(null);
  const [showContent, setShowContent] = useState(false);

  // Content show logic based on workflow type
  useEffect(() => {
    if (!isHomePage) {
      setShowContent(false);
      return;
    }

    if (isMobile) {
      // Mobile: show content immediately with no sequencing
      setShowContent(true);
    } else if (!isFreshLoad) {
      // Desktop SPA navigation: show content immediately
      setShowContent(true);
    } else {
      // Desktop fresh load: wait for video workflow
      setShowContent(false);
    }
  }, [isHomePage, isFreshLoad, isMobile]);

  // Listen for dive-in workflow to show content after 3 seconds (desktop only)
  useEffect(() => {
    if (!videoBehavior.isDiveInFlow || isMobile) return;

    // Set up content show timer for dive-in workflow
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 3000); // 3s delay for dive-in workflow

    return () => clearTimeout(timer);
  }, [videoBehavior.isDiveInFlow, isMobile]);

  const handleDiveIn = useCallback(() => {
    // Start video IMMEDIATELY on button click for instant response
    videoRef.current?.startVideo();
    
    // Hide the dive-in button after video starts (no delay needed)
    hideDiveInButton();
  }, [hideDiveInButton]);


  if (!isHomePage) {
    return null;
  }

  return (
    <motion.div 
      className="relative min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Video Background */}
      <VideoBackground ref={videoRef} showContent={showContent} />
      
      {/* Dive In Button Overlay - Desktop Only */}
      <AnimatePresence>
        {showDiveInButton && !isMobile && (
          <DiveInButton 
            onDiveIn={handleDiveIn}
            isReady={true}
          />
        )}
      </AnimatePresence>
      
      {/* Home Content */}
      {isMobile ? (
        // Mobile: No fade animation, content always visible
        <div className="h-screen relative z-10">
          <Navbar />
          <main className="absolute inset-0 top-auto overflow-hidden">
            <Home />
          </main>
        </div>
      ) : (
        // Desktop: Fade animation based on sequencing
        <FadeInContainer
          isVisible={showContent}
          className="h-screen relative z-10"
          delay={isFreshLoad ? 300 : 0}
        >
          <Navbar />
          <main className="absolute inset-0 top-auto overflow-hidden">
            <Home />
          </main>
        </FadeInContainer>
      )}
    </motion.div>
  );
};