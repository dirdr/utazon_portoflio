import { useState, useEffect, useCallback, useRef } from "react";
import { useTransitionContext } from "./useTransitionContext";
import {
  getVideoTransitionConfig,
  debugVideoTransition,
} from "../config/videoTransitionConfig";

export type MobileVideoSequenceState =
  | "loading"
  | "playing-mobile-anim"
  | "transitioning"
  | "playing-intro"
  | "looping";

export type MobileVideoType = "mobil_anim" | "intro_mobile";

export interface MobileVideoSequenceConfig {
  isFreshLoad: boolean;
  isHomePage: boolean;
  getVideoElement?: () => HTMLVideoElement | null;
}

export interface MobileVideoSequenceResult {
  sequenceState: MobileVideoSequenceState;
  currentVideoType: MobileVideoType;
  currentVideoSrc: string;
  isVideoLoaded: boolean;

  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  loopStartTime: number;

  onVideoLoaded: () => void;
  onVideoEnded: () => void;
  onVideoTimeUpdate: (currentTime: number) => void;
  onDiveInClick: () => void;
}

const getMobileVideoConfig = () => {
  const config = getVideoTransitionConfig();
  return {
    LOOP_START_MOBILE: config.fresh.mobileLoopStartTime,
    ANIMATION_DURATION: config.mobile.animationDuration || 2.5,
    INTRO_LOOP_START: config.mobile.introLoopStart || 0,
    ENABLE_ANIMATION: config.mobile.enableAnimation ?? true,
    MOBILE_MUTED: config.mobile.muted,
  };
};

const getVideoSrc = (videoType: MobileVideoType): string => {
  const basePath = "/videos/";
  switch (videoType) {
    case "mobil_anim":
      return `${basePath}mobil_anim.mp4`;
    case "intro_mobile":
      return `${basePath}intro_mobile.mp4`;
    default:
      return `${basePath}intro_mobile.mp4`;
  }
};

export const useMobileVideoSequence = (
  config: MobileVideoSequenceConfig,
): MobileVideoSequenceResult => {
  const { isFreshLoad, isHomePage, getVideoElement } = config;
  const { isTransitioning } = useTransitionContext();

  const videoConfig = getMobileVideoConfig();

  const [sequenceState, setSequenceState] =
    useState<MobileVideoSequenceState>("loading");
  const [currentVideoType, setCurrentVideoType] = useState<MobileVideoType>(
    isFreshLoad && videoConfig.ENABLE_ANIMATION ? "mobil_anim" : "intro_mobile",
  );
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isSequenceInitialized, setIsSequenceInitialized] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const loopStartTime = videoConfig.INTRO_LOOP_START;

  const currentVideoSrc = getVideoSrc(currentVideoType);

  const [showContentEarly, setShowContentEarly] = useState(false);

  const shouldShowContent =
    showContentEarly ||
    sequenceState === "playing-intro" ||
    sequenceState === "looping" ||
    !isFreshLoad ||
    !videoConfig.ENABLE_ANIMATION;
  const shouldShowDiveIn = false;

  const prevShouldShowContent = useRef(shouldShowContent);
  useEffect(() => {
    if (prevShouldShowContent.current !== shouldShowContent) {
      console.log("📱 Mobile shouldShowContent changed:", {
        from: prevShouldShowContent.current,
        to: shouldShowContent,
        sequenceState,
        currentVideoType,
        timestamp: new Date().toLocaleTimeString(),
      });
      prevShouldShowContent.current = shouldShowContent;
    }
  }, [shouldShowContent, sequenceState, currentVideoType]);

  const transitionToIntroVideo = useCallback(() => {
    if (
      sequenceState === "transitioning" ||
      currentVideoType === "intro_mobile"
    ) {
      debugVideoTransition(
        "Transition already in progress or completed, skipping",
      );
      return;
    }

    debugVideoTransition("Transitioning from mobil_anim to intro_mobile", {
      currentState: sequenceState,
      currentVideoType,
    });

    setSequenceState("transitioning");
    setCurrentVideoType("intro_mobile");
    setIsVideoLoaded(false);
  }, [sequenceState, currentVideoType]);

  const onVideoLoaded = useCallback(() => {
    console.log("🚀 [MOBILE_DEBUG] onVideoLoaded called", {
      timestamp: new Date().toLocaleTimeString(),
      sequenceState,
      currentVideoType,
      isHomePage,
      isFreshLoad,
      isTransitioning,
    });

    const video = getVideoElement ? getVideoElement() : videoRef.current;

    setIsVideoLoaded(true);

    if (!video) {
      console.warn("❌ [MOBILE_DEBUG] No video element found", {
        getVideoElement: !!getVideoElement,
        videoRef: !!videoRef.current,
      });
      return;
    }

    if (!isHomePage) {
      console.log("📍 [MOBILE_DEBUG] Not on home page, skipping video logic");
      return;
    }

    const shouldAllowDuringTransition = !isFreshLoad;
    if (isTransitioning && !shouldAllowDuringTransition) {
      console.log("⏳ [MOBILE_DEBUG] Skipping due to transition state", {
        isTransitioning,
        isFreshLoad,
        shouldAllowDuringTransition,
      });
      return;
    }

    if (
      sequenceState === "playing-mobile-anim" ||
      sequenceState === "playing-intro" ||
      sequenceState === "looping"
    ) {
      console.log("⚠️ [MOBILE_DEBUG] Already in playing state, skipping", {
        sequenceState,
      });
      return;
    }

    if (sequenceState === "transitioning") {
      // Transitioning from mobil_anim to intro_mobile
      console.log("🔄 [MOBILE_DEBUG] Handling transition state", {
        currentVideoType,
        loopStartTime,
        videoSrc: video.src,
      });
      video.currentTime = loopStartTime;
      video
        .play()
        .then(() => {
          console.log("✅ [MOBILE_DEBUG] Intro video started after transition");
          debugVideoTransition("Intro mobile video started after transition");
          setSequenceState("playing-intro");
        })
        .catch((error) => {
          console.error(
            "❌ [MOBILE_DEBUG] Intro video play failed after transition",
            error,
          );
          debugVideoTransition("Intro mobile video playback failed:", error);
        });
    } else if (
      currentVideoType === "mobil_anim" &&
      isFreshLoad &&
      videoConfig.ENABLE_ANIMATION
    ) {
      // Starting fresh load with animation
      console.log("🎬 [MOBILE_DEBUG] Starting mobile animation", {
        currentVideoType,
        isFreshLoad,
        enableAnimation: videoConfig.ENABLE_ANIMATION,
        videoSrc: video.src,
      });
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          console.log(
            "✅ [MOBILE_DEBUG] Mobile animation started successfully",
          );
          debugVideoTransition("Mobile animation video started");
          setSequenceState("playing-mobile-anim");

          setTimeout(() => {
            console.log(
              "🎨 [MOBILE_DEBUG] Showing content early (1s after animation)",
            );
            debugVideoTransition(
              "Showing content early (1s after animation start)",
            );
            setShowContentEarly(true);
          }, 500);
        })
        .catch((error) => {
          console.error(
            "❌ [MOBILE_DEBUG] Mobile animation play failed",
            error,
          );
          debugVideoTransition(
            "Mobile animation video playback failed:",
            error,
          );
          // Fallback to intro video
          transitionToIntroVideo();
        });
    } else {
      // Direct to intro video (SPA navigation or animation disabled)
      console.log("🎥 [MOBILE_DEBUG] Starting intro video directly", {
        currentVideoType,
        isFreshLoad,
        enableAnimation: videoConfig.ENABLE_ANIMATION,
        loopStartTime,
        videoSrc: video.src,
      });
      video.currentTime = loopStartTime;
      video
        .play()
        .then(() => {
          console.log("✅ [MOBILE_DEBUG] Intro video started directly");
          debugVideoTransition("Mobile intro video started directly");
          setSequenceState("playing-intro");
        })
        .catch((error) => {
          console.error(
            "❌ [MOBILE_DEBUG] Direct intro video play failed",
            error,
          );
          debugVideoTransition("Mobile intro video playback failed:", error);
        });
    }
  }, [
    isHomePage,
    isFreshLoad,
    getVideoElement,
    sequenceState,
    currentVideoType,
    isTransitioning,
    loopStartTime,
    transitionToIntroVideo,
    videoConfig.ENABLE_ANIMATION,
  ]);

  const onVideoEnded = useCallback(() => {
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;

    if (currentVideoType === "mobil_anim") {
      // Animation ended, transition to intro video
      transitionToIntroVideo();
    } else if (currentVideoType === "intro_mobile") {
      // Intro video ended, loop it
      video.currentTime = loopStartTime;
      video
        .play()
        .then(() => {
          setSequenceState("looping");
          debugVideoTransition("Mobile intro video looping");
        })
        .catch(() => {});
    }
  }, [
    currentVideoType,
    loopStartTime,
    getVideoElement,
    transitionToIntroVideo,
  ]);

  const onVideoTimeUpdate = useCallback(
    (currentTime: number) => {
      // For mobile, we don't need complex time-based state changes
      // The sequence is primarily driven by video ended events
      if (sequenceState === "playing-intro" && currentTime > 0) {
        // Ensure we're in the right state once intro starts playing
        return;
      }
    },
    [sequenceState],
  );

  const onDiveInClick = useCallback(() => {
    // No-op for mobile - no dive in functionality
  }, []);

  // Initialize sequence once based on navigation - DON'T interfere with sequence after it starts
  useEffect(() => {
    if (!isHomePage) {
      if (isTransitioning) {
        return;
      } else {
        setSequenceState("playing-intro");
        return;
      }
    }

    // Only initialize once per navigation change
    if (!isSequenceInitialized) {
      const initialVideoType =
        isFreshLoad && videoConfig.ENABLE_ANIMATION
          ? "mobil_anim"
          : "intro_mobile";

      setCurrentVideoType(initialVideoType);
      setIsVideoLoaded(false);
      setSequenceState("loading");
      setShowContentEarly(false); // Reset early show state
      setIsSequenceInitialized(true);
    }
  }, [
    isHomePage,
    isFreshLoad,
    isTransitioning,
    videoConfig.ENABLE_ANIMATION,
    isSequenceInitialized,
  ]);

  // Handle video source changes
  useEffect(() => {
    if (!isHomePage) return;

    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;

    const expectedSrc = getVideoSrc(currentVideoType);

    // Only load if the source is actually different (ignore host differences)
    const currentSrcPath = video.src.split("/").slice(-2).join("/"); // Get last 2 parts like "videos/intro_mobile.mp4"
    const expectedSrcPath = expectedSrc.slice(1); // Remove leading slash

    if (currentSrcPath === expectedSrcPath) {
      // Source is already correct, just make sure isVideoLoaded is true
      if (!isVideoLoaded) {
        setIsVideoLoaded(true);
      }
      return;
    }

    debugVideoTransition(`Loading mobile video: ${currentVideoType}`, {
      src: expectedSrc,
      previousSrc: video.src,
      currentSrcPath,
      expectedSrcPath,
    });

    setIsVideoLoaded(false);
    video.src = expectedSrc;
    video.load();
  }, [isHomePage, currentVideoType, getVideoElement]);

  return {
    sequenceState,
    currentVideoType,
    currentVideoSrc,
    isVideoLoaded,

    shouldShowContent,
    shouldShowDiveIn,

    videoRef,
    loopStartTime,

    onVideoLoaded,
    onVideoEnded,
    onVideoTimeUpdate,
    onDiveInClick,
  };
};

