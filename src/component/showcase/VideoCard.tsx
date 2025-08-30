import { useEffect, useRef, useState } from "react";

interface VideoCardProps {
  src: string;
  title?: string;
  onDurationChange?: (duration: number) => void;
  onProgress?: (progress: number) => void;
  onEnded?: () => void;
  isActive: boolean;
}

export const VideoCard = ({
  src,
  title,
  onDurationChange,
  onProgress,
  onEnded,
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

    const handleTimeUpdate = () => {
      if (onProgress && video.duration) {
        const progress = video.currentTime / video.duration;
        onProgress(progress);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      }
      // Reset video to beginning for next play
      video.currentTime = 0;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onDurationChange, onProgress, onEnded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && !isPlaying) {
      // Reset to beginning when starting a new video
      video.currentTime = 0;
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    } else if (!isActive && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying, src]); // Added src to dependency to reset when video changes

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

