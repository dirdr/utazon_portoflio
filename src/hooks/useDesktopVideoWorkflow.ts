import { useReducer, useEffect, useRef, useCallback } from "react";
import { useAppLoading } from "../contexts/AppLoadingContext";
import { VideoBackgroundRef } from "../component/layout/VideoBackground";

type DesktopPhase =
  | "LOADING"
  | "READY_FOR_DIVE_IN"
  | "PLAYING_ENTRY"
  | "PLAYING_LOOP";

interface DesktopVideoState {
  phase: DesktopPhase;
  videoSrc: string;
  showContent: boolean;
  showDiveIn: boolean;
}

type DesktopAction =
  | { type: "ASSETS_READY" }
  | { type: "DIVE_IN_CLICKED" }
  | { type: "ENTRY_ENDED" }
  | { type: "SHOW_CONTENT" };

export interface DesktopVideoResult {
  phase: DesktopPhase;
  videoSrc: string;
  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;
  isLoading: boolean;
  onVideoLoaded: () => void;
  onVideoEnded: () => void;
  onDiveInClick: () => void;
}

const DESKTOP_VIDEOS = {
  ENTRY: "/videos/intro/desktop/entry_desktop.mp4",
  LOOP: "/videos/intro/desktop/loop_desktop.mp4",
};

function desktopReducer(
  state: DesktopVideoState,
  action: DesktopAction,
  isFreshLoad: boolean,
): DesktopVideoState {

  switch (action.type) {
    case "ASSETS_READY":
      if (isFreshLoad) {
        return {
          ...state,
          phase: "READY_FOR_DIVE_IN",
          videoSrc: DESKTOP_VIDEOS.ENTRY,
          showDiveIn: true,
          showContent: false,
        };
      } else {
        return {
          ...state,
          phase: "PLAYING_LOOP",
          videoSrc: DESKTOP_VIDEOS.LOOP,
          showDiveIn: false,
          showContent: true,
        };
      }

    case "DIVE_IN_CLICKED":
      return {
        ...state,
        phase: "PLAYING_ENTRY",
        videoSrc: DESKTOP_VIDEOS.ENTRY,
        showDiveIn: false,
        showContent: false,
      };

    case "SHOW_CONTENT":
      return {
        ...state,
        showContent: true,
      };

    case "ENTRY_ENDED":
      return {
        ...state,
        phase: "PLAYING_LOOP",
        videoSrc: DESKTOP_VIDEOS.LOOP,
        showContent: true,
      };

    default:
      return state;
  }
}

export const useDesktopVideoWorkflow = (
  getVideoElement: () => HTMLVideoElement | null,
  videoBackgroundRef?: React.RefObject<VideoBackgroundRef | null>,
): DesktopVideoResult => {
  const { isFreshLoad } = useAppLoading();

  const [state, dispatch] = useReducer(
    (state: DesktopVideoState, action: DesktopAction) =>
      desktopReducer(state, action, isFreshLoad),
    {
      phase: "LOADING",
      videoSrc: "",
      showContent: false,
      showDiveIn: false,
    },
  );

  const contentTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.phase === "LOADING") {
      dispatch({ type: "ASSETS_READY" });
    }
  }, [state.phase]);

  useEffect(() => {
    const videoElement = getVideoElement();
    if (!videoElement || !state.videoSrc) return;

    const currentSrc = videoElement.src
      ? new URL(videoElement.src).pathname
      : "";

    if (currentSrc !== state.videoSrc) {
      if (state.phase !== "PLAYING_LOOP" || currentSrc === "") {
        videoElement.src = state.videoSrc;
        videoElement.preload = "auto";
        videoElement.load();
      }

      if (state.phase === "PLAYING_ENTRY") {
        const loopVideo = document.createElement("video");
        loopVideo.src = DESKTOP_VIDEOS.LOOP;
        loopVideo.preload = "auto";
        loopVideo.load();
      }
    }
  }, [state.videoSrc, state.phase, getVideoElement]);

  useEffect(() => {
    const videoElement = getVideoElement();
    if (!videoElement) return;

    if (state.phase === "PLAYING_ENTRY" || state.phase === "PLAYING_LOOP") {
      const playVideo = () => {
        videoElement.currentTime = 0;
        videoElement.play().catch(() => {});
      };

      if (videoElement.readyState >= 4) {
        playVideo();
      } else {
        videoElement.addEventListener("canplaythrough", playVideo, {
          once: true,
        });
        return () =>
          videoElement.removeEventListener("canplaythrough", playVideo);
      }
    }
  }, [state.phase, getVideoElement]);

  useEffect(() => {
    if (state.phase === "PLAYING_ENTRY" && !state.showContent) {
      contentTimerRef.current = setTimeout(() => {
        dispatch({ type: "SHOW_CONTENT" });
      }, 3000);

      return () => {
        if (contentTimerRef.current) {
          clearTimeout(contentTimerRef.current);
          contentTimerRef.current = null;
        }
      };
    }
  }, [state.phase, state.showContent]);

  const onVideoLoaded = useCallback(() => {}, []);

  const onVideoEnded = useCallback(() => {
    if (state.phase === "PLAYING_ENTRY") {
      const transitionMethod = videoBackgroundRef?.current?.transitionToVideo;

      if (transitionMethod) {
        transitionMethod(DESKTOP_VIDEOS.LOOP)
          .then(() => {
            dispatch({ type: "ENTRY_ENDED" });
          })
          .catch(() => {
            dispatch({ type: "ENTRY_ENDED" });
          });
      } else {
        dispatch({ type: "ENTRY_ENDED" });
      }
    } else if (state.phase === "PLAYING_LOOP") {
      const videoElement = getVideoElement();
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(() => {});
      }
    }
  }, [state.phase, getVideoElement, videoBackgroundRef]);

  const onDiveInClick = useCallback(() => {
    dispatch({ type: "DIVE_IN_CLICKED" });
  }, []);

  return {
    phase: state.phase,
    videoSrc: state.videoSrc,
    shouldShowContent: state.showContent,
    shouldShowDiveIn: state.showDiveIn,
    isLoading: state.phase === "LOADING",
    onVideoLoaded,
    onVideoEnded,
    onDiveInClick,
  };
};
