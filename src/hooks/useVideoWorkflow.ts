import { useState, useEffect, useCallback, useRef } from "react";
import { useTransitionContext } from "./useTransitionContext";
import { isDiveInCompleted, markDiveInCompleted } from "../utils/diveInStorage";
import {
  getVideoTransitionConfig,
  debugVideoTransition,
} from "../config/videoTransitionConfig";
import { isMobile } from "../utils/mobileDetection";

export type VideoWorkflowState =
  | "loading"
  | "ready"
  | "playing-intro"
  | "content-showing"
  | "spa-playing";

export interface VideoWorkflowConfig {
  isFreshLoad: boolean;
  isHomePage: boolean;
  videoSrc: string;
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
}

const getVideoConfig = () => {
  const config = getVideoTransitionConfig();
  return {
    LOOP_START_DESKTOP: config.fresh.loopStartTime,
    LOOP_START_MOBILE: config.fresh.mobileLoopStartTime,
    INTRO_DURATION: config.fresh.introDuration,
    SPA_JUMP_TIME: config.spa.jumpToTime,
    SPA_WITH_SOUND: config.spa.withSound,
    MOBILE_MUTED: config.mobile.muted,
  };
};

export const useVideoWorkflow = (
  config: VideoWorkflowConfig,
): VideoWorkflowResult => {
  const { isFreshLoad, isHomePage, videoSrc, getVideoElement } = config;
  const { isTransitioning } = useTransitionContext();
  const isMobileDetected = isMobile();

  const videoConfig = getVideoConfig();

  const [workflowState, setWorkflowState] =
    useState<VideoWorkflowState>("loading");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const loopStartTime = isMobileDetected
    ? videoConfig.LOOP_START_MOBILE
    : videoConfig.LOOP_START_DESKTOP;

  const shouldShowContent =
    isMobileDetected ||
    workflowState === "content-showing" ||
    workflowState === "spa-playing";
  const shouldShowDiveIn =
    workflowState === "ready" && !isMobileDetected && !isDiveInCompleted();

  const onVideoLoaded = useCallback(() => {
    const video = getVideoElement ? getVideoElement() : videoRef.current;

    setIsVideoLoaded(true);

    if (!video || !isHomePage) return;

    const shouldAllowDuringTransition = !isFreshLoad;
    if (isTransitioning && !shouldAllowDuringTransition) {
      return;
    }

    if (
      workflowState === "playing-intro" ||
      workflowState === "content-showing"
    ) {
      return;
    }

    if (isMobileDetected) {
      video.currentTime = 0;

      video
        .play()
        .then(() => {
          debugVideoTransition("Mobile video playback started");
        })
        .catch(() => {
          debugVideoTransition("Mobile video playback failed");
        });
      setWorkflowState("content-showing");
    } else if (isFreshLoad) {
      video.currentTime = 0;
      setWorkflowState("ready");
    } else {
      debugVideoTransition("SPA navigation detected, configuring video:", {
        jumpToTime: videoConfig.SPA_JUMP_TIME,
        withSound: videoConfig.SPA_WITH_SOUND,
        currentMuted: video.muted,
      });

      video.pause();
      video.currentTime = videoConfig.SPA_JUMP_TIME;

      const handleSeeked = () => {
        video.removeEventListener("seeked", handleSeeked);

        debugVideoTransition(
          `Starting SPA video playback from ${videoConfig.SPA_JUMP_TIME}s`,
        );

        video
          .play()
          .then(() => {
            debugVideoTransition("SPA video playback started successfully");
          })
          .catch((error) => {
            debugVideoTransition("SPA video playback failed:", error);
          });
      };

      video.addEventListener("seeked", handleSeeked);
      setWorkflowState("spa-playing");
    }
  }, [
    isHomePage,
    isFreshLoad,
    isMobileDetected,
    getVideoElement,
    workflowState,
    isTransitioning,
    videoConfig.SPA_JUMP_TIME,
    videoConfig.SPA_WITH_SOUND,
  ]);

  const onDiveInClick = useCallback(() => {
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video || workflowState !== "ready") {
      return;
    }

    markDiveInCompleted();

    video.currentTime = 0;
    video
      .play()
      .then(() => {
        setWorkflowState("playing-intro");
      })
      .catch(() => {});
  }, [workflowState, getVideoElement]);

  const onVideoTimeUpdate = useCallback(
    (currentTime: number) => {
      if (
        workflowState === "playing-intro" &&
        currentTime >= videoConfig.INTRO_DURATION &&
        !hasCompletedIntro
      ) {
        debugVideoTransition(
          `Intro completed at ${currentTime}s, showing content`,
        );
        setHasCompletedIntro(true);
        setWorkflowState("content-showing");
      }
    },
    [workflowState, hasCompletedIntro, videoConfig.INTRO_DURATION],
  );

  const onVideoEnded = useCallback(() => {
    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;

    video.currentTime = loopStartTime;
    video.play().catch(() => {});
  }, [loopStartTime, getVideoElement]);

  useEffect(() => {
    if (!isHomePage) {
      if (isTransitioning) {
        return;
      } else {
        setWorkflowState("content-showing");
        return;
      }
    }

    setHasCompletedIntro(false);

    if (isVideoLoaded) {
      if (isMobileDetected) {
        setWorkflowState("content-showing");
      } else if (isFreshLoad) {
        setWorkflowState("ready");
      } else {
        setWorkflowState("spa-playing");
      }
    } else {
      setWorkflowState("loading");
    }
  }, [
    isHomePage,
    isFreshLoad,
    isMobileDetected,
    isVideoLoaded,
    isTransitioning,
  ]);

  useEffect(() => {
    if (!isHomePage || !videoSrc) return;

    const video = getVideoElement ? getVideoElement() : videoRef.current;
    if (!video) return;

    if (video.src.endsWith(videoSrc) && isVideoLoaded) {
      return;
    }

    setIsVideoLoaded(false);
    video.load();
  }, [isHomePage, videoSrc, getVideoElement, isVideoLoaded]);

  return {
    workflowState,
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
