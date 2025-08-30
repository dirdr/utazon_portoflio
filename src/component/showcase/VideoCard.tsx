import { useEffect, useRef, useState } from "react";

interface VideoCardProps {
  src: string;
  title?: string;
  onDurationChange?: (duration: number) => void;
  onEnded?: () => void;
  onPlay?: () => void;
  isActive: boolean;
}

export const VideoCard = ({
  src,
  onDurationChange,
  onEnded,
  onPlay,
  isActive,
}: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (onDurationChange && video.duration) {
        onDurationChange(video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      }
      video.currentTime = 0;
    };

    const handlePlay = () => {
      if (onPlay) {
        onPlay();
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
    };
  }, [onDurationChange, onEnded, onPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPlaying) {
      video.currentTime = 0;
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else if (!isActive && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying, src]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        autoPlay
      />
    </div>
  );
};
