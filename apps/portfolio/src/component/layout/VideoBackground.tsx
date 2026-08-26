import {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useLocation } from "wouter";
import { RadialGradient } from "../common/RadialGradient";
import { ANIMATION_CLASSES } from "../../constants/animations";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";
import { isMobile } from "../../utils/mobileDetection";

// Generous enough for a 4K clip on a cold cache; the outgoing video is
// still playing while we wait, so this is not a visible stall.
const READY_TIMEOUT_MS = 10000;

export interface VideoBackgroundRef {
  startVideo: () => void;
  setMuted: (muted: boolean) => void;
  video: HTMLVideoElement | null;
  transitionToVideo: (newSrc: string) => Promise<void>;
}

interface VideoBackgroundProps {
  src?: string;
  poster?: string;
  showGradient?: boolean;
  gradientDelay?: number;
  onLoadedData?: () => void;
  onTimeUpdate?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  onEnded?: () => void;
}

export const VideoBackground = forwardRef<
  VideoBackgroundRef,
  VideoBackgroundProps
>(
  (
    {
      src,
      poster,
      showGradient = false,
      gradientDelay = 0,
      onLoadedData,
      onTimeUpdate,
      onEnded,
    },
    ref,
  ) => {
    const [location] = useLocation();
    const isHomePage = location === "/";
    const isMobileDetected = isMobile();

    const videoRef = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);

    const [activeVideoIndex, setActiveVideoIndex] = useState<0 | 1>(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const loadedSources = useRef(new Set<string>());

    const videoSource = useMemo(() => {
      return src || null;
    }, [src]);

    useEffect(() => {
      loadedSources.current.clear();
    }, [videoSource]);

    useEffect(() => {
      const video1 = videoRef.current;
      const video2 = videoRef2.current;
      if (!isHomePage) return;

      if (video1) video1.volume = 0.3;
      if (video2) video2.volume = 0.3;

      const handlersMap = new Map<
        HTMLVideoElement,
        { loaded: () => void; ended: () => void }
      >();

      const handleTimeUpdate = (e: Event) => {
        const target = e.target as HTMLVideoElement;
        const isActiveVideo =
          (activeVideoIndex === 0 && target === video1) ||
          (activeVideoIndex === 1 && target === video2);
        if (isActiveVideo) {
          onTimeUpdate?.(
            e as unknown as React.SyntheticEvent<HTMLVideoElement>,
          );
        }
      };

      [video1, video2].forEach((video) => {
        if (video) {
          const loadedHandler = () => {
            const currentSource = video.src;
            if (!loadedSources.current.has(currentSource)) {
              loadedSources.current.add(currentSource);
              onLoadedData?.();
            }
          };
          const endedHandler = () => {
            const isActiveVideo =
              (activeVideoIndex === 0 && video === video1) ||
              (activeVideoIndex === 1 && video === video2);
            if (isActiveVideo) {
              onEnded?.();
            }
          };

          handlersMap.set(video, {
            loaded: loadedHandler,
            ended: endedHandler,
          });

          video.addEventListener("loadeddata", loadedHandler);
          video.addEventListener("timeupdate", handleTimeUpdate);
          video.addEventListener("ended", endedHandler);

          if (video.readyState >= 2 && !loadedSources.current.has(video.src)) {
            loadedSources.current.add(video.src);
            setTimeout(() => onLoadedData?.(), 0);
          }
        }
      });

      return () => {
        [video1, video2].forEach((video) => {
          if (video) {
            const handlers = handlersMap.get(video);
            if (handlers) {
              video.removeEventListener("loadeddata", handlers.loaded);
              video.removeEventListener("ended", handlers.ended);
            }
            video.removeEventListener("timeupdate", handleTimeUpdate);
          }
        });
      };
    }, [isHomePage, activeVideoIndex, onLoadedData, onTimeUpdate, onEnded]);

    const startVideo = useCallback(() => {
      const video = videoRef.current;
      if (!video) return;

      video.currentTime = 0;
      video.play().catch(() => {});
    }, []);

    const setMuted = useCallback((muted: boolean) => {
      const video = videoRef.current;
      const video2 = videoRef2.current;
      if (video) video.muted = muted;
      if (video2) video2.muted = muted;
    }, []);

    const transitionToVideo = useCallback(
      async (newSrc: string) => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        const currentVideo =
          activeVideoIndex === 0 ? videoRef.current : videoRef2.current;
        const nextVideo =
          activeVideoIndex === 0 ? videoRef2.current : videoRef.current;

        if (!currentVideo || !nextVideo) {
          setIsTransitioning(false);
          return;
        }

        try {
          const currentMuted = currentVideo.muted;

          nextVideo.src = newSrc;
          nextVideo.currentTime = 0;
          nextVideo.volume = 0.3;
          nextVideo.muted = currentMuted;
          nextVideo.style.opacity = "0";
          nextVideo.style.zIndex = "1";

          await new Promise((resolve, reject) => {
            let settled = false;
            let timer: ReturnType<typeof setTimeout> | undefined;

            const cleanup = () => {
              nextVideo.removeEventListener("loadeddata", handleReady);
              nextVideo.removeEventListener("canplay", handleReady);
              nextVideo.removeEventListener("error", handleError);
              if (timer) clearTimeout(timer);
            };
            const settle = (ok: boolean) => {
              if (settled) return;
              settled = true;
              cleanup();
              if (ok) resolve(undefined);
              else reject(new Error("Video load failed"));
            };
            // Wait for HAVE_CURRENT_DATA rather than canplaythrough, which
            // mobile Safari often withholds. Never settle without a decoded
            // frame: this layer gets faded in immediately afterwards, and
            // revealing an empty element shows a black screen.
            const handleReady = () => {
              if (nextVideo.readyState >= 2) settle(true);
            };
            const handleError = () => settle(false);

            // A cap so the sequence can never hang, but it still refuses to
            // swap in a frameless layer; the caller falls back to playing the
            // source on the primary element instead.
            timer = setTimeout(
              () => settle(nextVideo.readyState >= 2),
              READY_TIMEOUT_MS,
            );

            nextVideo.addEventListener("loadeddata", handleReady);
            nextVideo.addEventListener("canplay", handleReady);
            nextVideo.addEventListener("error", handleError, { once: true });
            nextVideo.load();
          });

          await nextVideo.play();

          requestAnimationFrame(() => {
            nextVideo.style.opacity = "1";
            nextVideo.style.zIndex = "2";
            currentVideo.style.opacity = "0";
            currentVideo.style.zIndex = "0";

            requestAnimationFrame(() => {
              currentVideo.pause();
              setActiveVideoIndex(activeVideoIndex === 0 ? 1 : 0);
              setIsTransitioning(false);
            });
          });
        } catch {
          setIsTransitioning(false);
        }
      },
      [activeVideoIndex, isTransitioning],
    );

    useImperativeHandle(
      ref,
      () => ({
        startVideo,
        setMuted,
        video: activeVideoIndex === 0 ? videoRef.current : videoRef2.current,
        transitionToVideo,
      }),
      [startVideo, setMuted, activeVideoIndex, transitionToVideo],
    );

    if (!isHomePage) {
      return null;
    }

    return (
      <div
        className="fixed inset-0 video-container"
        style={{ zIndex: OVERLAY_Z_INDEX.VIDEO_BACKGROUND }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover gpu-accelerated absolute inset-0"
          muted={isMobileDetected}
          autoPlay={isMobileDetected}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          crossOrigin="anonymous"
          poster={poster}
          src={videoSource || undefined}
          style={{
            contentVisibility: "auto",
            willChange: "auto",
            opacity: activeVideoIndex === 0 ? 1 : 0,
            zIndex: activeVideoIndex === 0 ? 1 : 0,
            transition: "none",
          }}
        />

        <video
          ref={videoRef2}
          className="w-full h-full object-cover gpu-accelerated absolute inset-0"
          muted={isMobileDetected}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          crossOrigin="anonymous"
          poster={poster}
          style={{
            contentVisibility: "auto",
            willChange: "auto",
            opacity: activeVideoIndex === 1 ? 1 : 0,
            zIndex: activeVideoIndex === 1 ? 1 : 0,
            transition: "none",
          }}
        />

        {!isMobile() && (
          <div
            className={`fixed inset-0 pointer-events-none ${
              ANIMATION_CLASSES.TRANSITION
            } ${showGradient ? ANIMATION_CLASSES.VISIBLE : ANIMATION_CLASSES.HIDDEN}`}
            style={{
              zIndex: OVERLAY_Z_INDEX.VIDEO_GRADIENT,
              transitionDelay:
                gradientDelay > 0 ? `${gradientDelay}ms` : undefined,
            }}
          >
            <RadialGradient
              size={15}
              opacity={0.5}
              className="w-full h-full"
              edgeColor="rgba(0, 0, 0, 0.95)"
              centerColor="transparent"
            />
          </div>
        )}
      </div>
    );
  },
);
