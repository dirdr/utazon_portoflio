import { useEffect, useRef, useState } from "react";

interface VideoCardProps {
  src: string;
  title?: string;
  onDurationChange?: (duration: number) => void;
  isActive: boolean;
}

export const VideoCard = ({ src, title, onDurationChange, isActive }: VideoCardProps) => {
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
      video.currentTime = 0;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onDurationChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPlaying) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else if (!isActive && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

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
      {title && (
        <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
          {title}
        </div>
      )}
    </div>
  );
};