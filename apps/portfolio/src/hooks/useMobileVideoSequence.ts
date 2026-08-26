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
    }
  }, [state.videoSrc, state.phase, getVideoElement]);

  /**
   * Warm the loop clip only once the entry clip is actually playing. Fetching
   * both at once split the connection and competed for the small number of
   * media decoders mobile browsers allow.
   */
  useEffect(() => {
    if (state.phase !== "PLAYING_ANIM") return;

    const videoElement = getVideoElement();
    if (!videoElement) return;

    let warmer: HTMLVideoElement | null = null;
    const warm = () => {
      if (warmer) return;
      warmer = document.createElement("video");
      warmer.muted = true;
      warmer.preload = "auto";
      warmer.src = MOBILE_VIDEOS.INTRO;
      warmer.load();
    };

    videoElement.addEventListener("playing", warm, { once: true });
    return () => {
      videoElement.removeEventListener("playing", warm);
      if (warmer) {
        warmer.removeAttribute("src");
        warmer.load();
        warmer = null;
      }
    };
  }, [state.phase, getVideoElement]);

  useEffect(() => {
    const videoElement = getVideoElement();
    if (!videoElement) return;

    if (
      state.phase !== "PLAYING_ANIM" &&
      state.phase !== "PLAYING_INTRO" &&
      state.phase !== "LOOPING"
    ) {
      return;
    }

    let cancelled = false;
    let started = false;
    const playVideo = () => {
      if (cancelled || started) return;
      started = true;
      videoElement.currentTime = 0;
      videoElement.play().catch(() => {});
    };

    // HAVE_CURRENT_DATA is enough to start rendering. The previous code waited
    // for canplaythrough, which mobile Safari frequently never fires under Low
    // Power Mode or a throttled connection, so the intro simply never played.
    if (videoElement.readyState >= 2) {
      playVideo();
      return () => {
        cancelled = true;
      };
    }

    videoElement.addEventListener("loadeddata", playVideo);
    videoElement.addEventListener("canplay", playVideo);

    // The element can become ready between the check above and these
    // listeners being attached, which would otherwise wait forever.
    if (videoElement.readyState >= 2) playVideo();

    return () => {
      cancelled = true;
      videoElement.removeEventListener("loadeddata", playVideo);
      videoElement.removeEventListener("canplay", playVideo);
    };
  }, [state.phase, state.videoSrc, getVideoElement]);

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
