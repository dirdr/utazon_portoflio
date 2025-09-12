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

export interface VideoBackgroundRef {
  startVideo: () => void;
  setMuted: (muted: boolean) => void;
  video: HTMLVideoElement | null;
  transitionToVideo: (newSrc: string) => Promise<void>;
}

interface VideoBackgroundProps {
  src?: string;
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
    
    // Track which video is currently active
    const [activeVideoIndex, setActiveVideoIndex] = useState<0 | 1>(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const loadedSources = useRef(new Set<string>());

    const videoSource = useMemo(() => {
      // Return null for empty/undefined src to avoid browser warning
      return src || null;
    }, [src]);

    useEffect(() => {
      loadedSources.current.clear();
    }, [videoSource]);

    useEffect(() => {
      const video1 = videoRef.current;
      const video2 = videoRef2.current;
      if (!isHomePage) return;

      const handleLoadedData = (video: HTMLVideoElement) => () => {
        const currentSource = video.src;
        if (!loadedSources.current.has(currentSource)) {
          loadedSources.current.add(currentSource);
          onLoadedData?.();
        }
      };

      const handleTimeUpdate = (e: Event) => {
        // Only handle time updates from active video
        const target = e.target as HTMLVideoElement;
        const isActiveVideo = (activeVideoIndex === 0 && target === video1) || 
                             (activeVideoIndex === 1 && target === video2);
        if (isActiveVideo) {
          onTimeUpdate?.(e as unknown as React.SyntheticEvent<HTMLVideoElement>);
        }
      };

      const handleEnded = (video: HTMLVideoElement) => () => {
        // Only handle ended events from active video
        const isActiveVideo = (activeVideoIndex === 0 && video === video1) || 
                             (activeVideoIndex === 1 && video === video2);
        if (isActiveVideo) {
          onEnded?.();
        }
      };

      const handlePlay = () => {};
      const handlePause = () => {};

      // Add event listeners to both videos
      [video1, video2].forEach(video => {
        if (video) {
          const loadedHandler = handleLoadedData(video);
          const endedHandler = handleEnded(video);
          
          video.addEventListener("loadeddata", loadedHandler);
          video.addEventListener("timeupdate", handleTimeUpdate);
          video.addEventListener("ended", endedHandler);
          video.addEventListener("play", handlePlay);
          video.addEventListener("pause", handlePause);

          if (video.readyState >= 2 && !loadedSources.current.has(video.src)) {
            loadedSources.current.add(video.src);
            setTimeout(() => onLoadedData?.(), 0);
          }
        }
      });

      return () => {
        [video1, video2].forEach(video => {
          if (video) {
            const loadedHandler = handleLoadedData(video);
            const endedHandler = handleEnded(video);
            
            video.removeEventListener("loadeddata", loadedHandler);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", endedHandler);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
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

    const transitionToVideo = useCallback(async (newSrc: string) => {
      if (isTransitioning) return;
      
      setIsTransitioning(true);
      
      const currentVideo = activeVideoIndex === 0 ? videoRef.current : videoRef2.current;
      const nextVideo = activeVideoIndex === 0 ? videoRef2.current : videoRef.current;
      
      if (!currentVideo || !nextVideo) {
        setIsTransitioning(false);
        return;
      }

      try {
        const currentVolume = currentVideo.volume;
        const currentMuted = currentVideo.muted;
        
        nextVideo.src = newSrc;
        nextVideo.currentTime = 0;
        nextVideo.volume = currentVolume;
        nextVideo.muted = currentMuted;
        nextVideo.style.opacity = '0';
        nextVideo.style.zIndex = '1';
        
        await new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            nextVideo.removeEventListener('canplaythrough', handleCanPlay);
            nextVideo.removeEventListener('error', handleError);
            resolve(undefined);
          };
          const handleError = () => {
            nextVideo.removeEventListener('canplaythrough', handleCanPlay);
            nextVideo.removeEventListener('error', handleError);
            reject(new Error('Video load failed'));
          };
          
          nextVideo.addEventListener('canplaythrough', handleCanPlay, { once: true });
          nextVideo.addEventListener('error', handleError, { once: true });
          nextVideo.load();
        });

        await nextVideo.play();
        
        requestAnimationFrame(() => {
          nextVideo.style.opacity = '1';
          nextVideo.style.zIndex = '2';
          currentVideo.style.opacity = '0';
          currentVideo.style.zIndex = '0';
          
          requestAnimationFrame(() => {
            currentVideo.pause();
            setActiveVideoIndex(activeVideoIndex === 0 ? 1 : 0);
            setIsTransitioning(false);
          });
        });
        
      } catch (error) {
        setIsTransitioning(false);
      }
    }, [activeVideoIndex, isTransitioning]);

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
        {/* Primary video element */}
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
          src={videoSource || undefined}
          style={{
            contentVisibility: "auto",
            willChange: "auto",
            opacity: activeVideoIndex === 0 ? 1 : 0,
            zIndex: activeVideoIndex === 0 ? 1 : 0,
            transition: 'none'
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
          style={{
            contentVisibility: "auto",
            willChange: "auto",
            opacity: activeVideoIndex === 1 ? 1 : 0,
            zIndex: activeVideoIndex === 1 ? 1 : 0,
            transition: 'none'
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
