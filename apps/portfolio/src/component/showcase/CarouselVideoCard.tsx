import { useRef } from "react";
import ReactPlayer from "react-player";
import { usePresignedVideoUrl } from "../../hooks/usePresignedVideoUrl";
import { useVideoReady } from "../../hooks/useVideoReady";
import { Skeleton } from "../common/Skeleton";

interface CarouselVideoCardProps {
  src: string;
  title?: string;
  onDurationChange?: (duration: number) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  isActive: boolean;
}

export const CarouselVideoCard = ({
  src,
  onDurationChange,
  onEnded,
  onPlay,
  isActive,
}: CarouselVideoCardProps) => {
  const playerRef = useRef<HTMLVideoElement | null>(null);
  const { url: videoUrl, loading } = usePresignedVideoUrl(src);
  const media = useVideoReady();

  const handleDuration = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.target as HTMLVideoElement;
    if (onDurationChange && video.duration) {
      onDurationChange(video.duration);
    }
  };

  const handleEnded = () => {
    if (onEnded) {
      onEnded();
    }
  };

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <div className="relative w-full h-full">
      {(loading || !media.ready) && (
        <Skeleton className="absolute inset-0 z-[5]" />
      )}
      {videoUrl && (
        <ReactPlayer
          ref={playerRef}
          src={videoUrl}
          playing={isActive}
          muted={true}
          controls={false}
          onLoadedMetadata={handleDuration}
          onEnded={handleEnded}
          onStart={handlePlay}
          onReady={media.onCanPlay}
          onError={media.onError}
          playsInline={true}
          width="100%"
          height="100%"
          className="react-player"
          style={{
            objectFit: "cover" as const,
          }}
        />
      )}
    </div>
  );
};
