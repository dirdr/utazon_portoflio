import { useRef } from "react";
import ReactPlayer from "react-player";
import { getVideoUrl } from "../../utils/videoUrl";

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
  const videoUrl = getVideoUrl(src);

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
        objectFit: 'cover' as const,
      }}
    />
  );
};
