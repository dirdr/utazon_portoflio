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
  const playerRef = useRef<any>(null);
  const videoUrl = getVideoUrl(src);

  const handleDuration = (event: any) => {
    const video = event.target;
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

  const handleReady = () => {
    if (isActive && playerRef.current) {
      playerRef.current.seekTo(0);
    }
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        src={videoUrl}
        width="100%"
        height="100%"
        playing={isActive}
        muted={true}
        controls={false}
        onLoadedMetadata={handleDuration}
        onEnded={handleEnded}
        onStart={handlePlay}
        onReady={handleReady}
        playsInline={true}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto'
        }}
      />
    </div>
  );
};
