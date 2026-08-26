import { useRef } from "react";
import ReactPlayer from "react-player";
import { usePresignedVideoUrl } from "../../hooks/usePresignedVideoUrl";

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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/10">
        <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!videoUrl) {
    return null;
  }

  return (
    <ReactPlayer
      ref={playerRef}
      src={videoUrl}
      playing={isActive}
      muted={true}
      controls={false}
      onLoadedMetadata={handleDuration}
      onEnded={handleEnded}
      onStart={handlePlay}
      playsInline={true}
      width="100%"
      height="100%"
      className="react-player"
      style={{
        objectFit: "cover" as const,
      }}
    />
  );
};
