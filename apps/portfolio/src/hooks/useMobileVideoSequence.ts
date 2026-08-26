import { useReducer, useEffect, useRef, useCallback } from "react";
import { useAppLoading } from "../contexts/AppLoadingContext";
import { VideoBackgroundRef } from "../component/layout/VideoBackground";

type MobilePhase = "LOADING" | "PLAYING_ANIM" | "PLAYING_INTRO" | "LOOPING";

interface MobileVideoState {
  phase: MobilePhase;
  videoSrc: string;
  showContent: boolean;
  isAnimationComplete: boolean;
}

type MobileAction =
  | { type: "ASSETS_READY" }
  | { type: "ANIM_ENDED" }
  | { type: "INTRO_LOOP" }
  | { type: "SHOW_CONTENT" };

export interface MobileVideoResult {
  phase: MobilePhase;
  videoSrc: string;
  shouldShowContent: boolean;
  shouldShowDiveIn: boolean;
  isLoading: boolean;
  onVideoLoaded: () => void;
  onVideoEnded: () => void;
  onDiveInClick: () => void;
}

const MOBILE_VIDEOS = {
  ANIM: "/videos/intro/mobile/entry_mobile.mp4",
  INTRO: "/videos/intro/mobile/loop_mobile.mp4",
};

function mobileReducer(
  state: MobileVideoState,
  action: MobileAction,
  isFreshLoad: boolean,
): MobileVideoState {
  switch (action.type) {
    case "ASSETS_READY":
      if (isFreshLoad) {
        return {
          ...state,
          phase: "PLAYING_ANIM",
          videoSrc: MOBILE_VIDEOS.ANIM,
          showContent: false,
          isAnimationComplete: false,
        };
      } else {
        return {
          ...state,
          phase: "PLAYING_INTRO",
          videoSrc: MOBILE_VIDEOS.INTRO,
          showContent: true,
          isAnimationComplete: true,
        };
      }

    case "SHOW_CONTENT":
      return {
        ...state,
        showContent: true,
      };

    case "ANIM_ENDED":
      return {
        ...state,
        phase: "PLAYING_INTRO",
        videoSrc: MOBILE_VIDEOS.INTRO,
        showContent: true,
        isAnimationComplete: true,
      };

    case "INTRO_LOOP":
      return {
        ...state,
        phase: "LOOPING",
      };

    default:
      return state;
  }
}

export const useMobileVideoSequence = (
  getVideoElement: () => HTMLVideoElement | null,
  videoBackgroundRef?: React.RefObject<VideoBackgroundRef | null>,
): MobileVideoResult => {
  const { isFreshLoad } = useAppLoading();

  const [state, dispatch] = useReducer(
    (state: MobileVideoState, action: MobileAction) =>
      mobileReducer(state, action, isFreshLoad),
    {
      phase: "LOADING",
      videoSrc: "",
      showContent: false,
      isAnimationComplete: false,
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
      if (state.phase !== "PLAYING_INTRO" || currentSrc === "") {
        videoElement.src = state.videoSrc;
        videoElement.preload = "auto";
        videoElement.load();
      }

      if (state.phase === "PLAYING_ANIM") {
        const introVideo = document.createElement("video");
        introVideo.src = MOBILE_VIDEOS.INTRO;
        introVideo.preload = "auto";
        introVideo.load();
      }
    }
  }, [state.videoSrc, state.phase, getVideoElement]);

  useEffect(() => {
    const videoElement = getVideoElement();
    if (!videoElement) return;

    if (
      state.phase === "PLAYING_ANIM" ||
      state.phase === "PLAYING_INTRO" ||
      state.phase === "LOOPING"
    ) {
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
    if (state.phase === "PLAYING_ANIM" && !state.showContent) {
      contentTimerRef.current = setTimeout(() => {
        dispatch({ type: "SHOW_CONTENT" });
      }, 500);

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
    if (state.phase === "PLAYING_ANIM") {
      const transitionMethod = videoBackgroundRef?.current?.transitionToVideo;

      if (transitionMethod) {
        transitionMethod(MOBILE_VIDEOS.INTRO)
          .then(() => {
            dispatch({ type: "ANIM_ENDED" });
          })
          .catch(() => {
            dispatch({ type: "ANIM_ENDED" });
          });
      } else {
        dispatch({ type: "ANIM_ENDED" });
      }
    } else if (state.phase === "PLAYING_INTRO" || state.phase === "LOOPING") {
      const videoElement = getVideoElement();
      if (videoElement) {
        videoElement.currentTime = 0;
        videoElement.play().catch(() => {});
      }
      dispatch({ type: "INTRO_LOOP" });
    }
  }, [state.phase, getVideoElement, videoBackgroundRef]);

  const onDiveInClick = useCallback(() => {}, []);

  return {
    phase: state.phase,
    videoSrc: state.videoSrc,
    shouldShowContent: state.showContent,
    shouldShowDiveIn: false, // Mobile never shows dive-in
    isLoading: state.phase === "LOADING",
    onVideoLoaded,
    onVideoEnded,
    onDiveInClick,
  };
};
