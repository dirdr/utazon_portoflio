import { useState, useEffect, useCallback, useRef } from "react";
import { useTransitionContext } from "./useTransitionContext";
import { isDiveInCompleted, markDiveInCompleted } from "../utils/diveInStorage";
import {
  getVideoTransitionConfig,
  debugVideoTransition,
} from "../config/videoTransitionConfig";

export type DesktopVideoWorkflowState =
  | "loading"
  | "ready"
  | "playing-intro"
  | "content-showing"
  | "spa-playing";

export interface DesktopVideoWorkflowConfig {
  isFreshLoad: boolean;
  isHomePage: boolean;
  videoSrc: string;
  getVideoElement?: () => HTMLVideoElement | null;
}

export interface DesktopVideoWorkflowResult {
  workflowState: DesktopVideoWorkflowState;
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
    INTRO_DURATION: config.fresh.introDuration,
    SPA_JUMP_TIME: config.spa.jumpToTime,
    SPA_WITH_SOUND: config.spa.withSound,
  };
};

export const useDesktopVideoWorkflow = (
  config: DesktopVideoWorkflowConfig,
): DesktopVideoWorkflowResult => {
  const { isFreshLoad, isHomePage, videoSrc, getVideoElement } = config;
  const { isTransitioning } = useTransitionContext();

  const videoConfig = getVideoConfig();

  const [workflowState, setWorkflowState] =
    useState<DesktopVideoWorkflowState>("loading");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasCompletedIntro, setHasCompletedIntro] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const loopStartTime = videoConfig.LOOP_START_DESKTOP;

  const shouldShowContent =
    workflowState === "content-showing" || workflowState === "spa-playing";
  const shouldShowDiveIn = workflowState === "ready" && !isDiveInCompleted();

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

    if (isFreshLoad) {
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
      if (isFreshLoad) {
        setWorkflowState("ready");
      } else {
        setWorkflowState("spa-playing");
      }
    } else {
      setWorkflowState("loading");
    }
  }, [isHomePage, isFreshLoad, isVideoLoaded, isTransitioning]);

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

