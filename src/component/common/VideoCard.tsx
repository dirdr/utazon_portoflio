import { cn } from "../../utils/cn";
import { useRef, useState, useEffect } from "react";

export interface VideoCardProps {
  video: {
    src: string;
    alt: string;
  };
  title: string;
  description: string;
  className?: string;
  glintSpeed?: string;
}

export const VideoCard = ({
  video,
  title,
  description,
  className,
  glintSpeed = "6s",
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoReady && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoReady]);

  return (
    <div
      className={cn(
        "group glint-card-wrapper-square w-full",
        className,
      )}
      style={{ "--glint-card-speed": glintSpeed } as React.CSSProperties}
    >
      <div className="glint-card-content-square">
        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden">
          <div className="relative h-[65%] w-full">
            {!videoError && (
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                src={video.src}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedData={() => {
                  setVideoReady(true);
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

          <div className="h-[35%] bg-black flex flex-col justify-center px-14 py-14">
            <h3 className="font-nord text-white text-xl font-bold italic mb-4">
              {title}
            </h3>
            <p className="text-white font-light text-base">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
