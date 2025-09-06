import { cn } from "../../utils/cn";
import { useRef, useState, useEffect } from "react";
import { useAnimationControl } from "../../hooks/useAnimationControl";

export interface ProjectVideoCardProps {
  video: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  className?: string;
  glintSpeed?: string;
}

export const ProjectVideoCard = ({
  video,
  title,
  description,
  className,
  glintSpeed = "6s",
}: ProjectVideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const { ref: animationRef, shouldAnimate } = useAnimationControl({
    threshold: 0.2,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (videoReady && videoRef.current) {
      // Safari-friendly autoplay attempt
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay failed, likely due to Safari restrictions
          // Video will show first frame and can be played on user interaction
        });
      }
    }
  }, [videoReady]);

  return (
    <div
      ref={animationRef}
      className={cn(
        "group glint-card-wrapper-square w-full",
        className,
      )}
      data-animate={shouldAnimate}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
    >
      <div className="glint-card-content-square">
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden video-container flex flex-col bg-black">
          <div className="relative flex-[55] w-full">
            {!videoError && (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={video.src}
                muted
                loop
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                preload="metadata"
                webkit-playsinline="true"
                x5-playsinline="true"
                style={{
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                }}
                onLoadedData={() => {
                  setVideoReady(true);
                }}
                onLoadedMetadata={() => {
                  // Additional Safari compatibility
                  if (videoRef.current) {
                    setVideoReady(true);
                  }
                }}
                onCanPlay={() => {
                  // Safari needs this event too
                  if (videoRef.current) {
                    setVideoReady(true);
                  }
                }}
                onError={() => {
                  setVideoReady(false);
                  setVideoError(true);
                }}
              />
            )}

            {videoError && (
              <div className="h-full w-full bg-black flex items-center justify-center">
                <p className="text-white">Video unavailable</p>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
          </div>

          <div className="flex-[45] bg-black flex flex-col justify-center items-start px-14">
            <h3 className="font-nord text-white text-sm sm:text-base md:text-lg xl:text-base 2xl:text-xl font-bold italic mb-1 sm:mb-2 md:mb-3 xl:mb-2 2xl:mb-4">
              {title}
            </h3>
            <p className="text-white font-light text-xs sm:text-sm md:text-base xl:text-sm 2xl:text-base">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
