import ReactPlayer from "react-player";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { usePresignedVideoUrl } from "../../hooks/usePresignedVideoUrl";
import { Skeleton } from "./Skeleton";
import { useShowcaseRevealed } from "../../contexts/showcaseReveal";

interface InteractiveVideoPlayerProps {
  src: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  className?: string;
  style?: React.CSSProperties;
  pip?: boolean;
  playing?: boolean;
  volume?: number;
  startTime?: number;
}

export const InteractiveVideoPlayer = ({
  src,
  width = "100%",
  height = "100%",
  controls = true,
  className,
  style,
  pip = false,
  playing: externalPlaying,
  volume = 0.8,
  startTime = 0,
}: InteractiveVideoPlayerProps) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [hasUserClicked, setHasUserClicked] = useState(false);
  const [userHasPaused, setUserHasPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const revealed = useShowcaseRevealed();
  const playerRef = useRef<HTMLVideoElement | null>(null);

  // Fetch presigned URL for backend videos
  const { url: videoUrl, loading: urlLoading } = usePresignedVideoUrl(src);

  const playing = userHasPaused ? false : (externalPlaying ?? internalPlaying);

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  const handleDuration = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (!hasUserClicked && startTime > 0 && player.duration) {
      player.currentTime = startTime;
    }
  }, [hasUserClicked, startTime]);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const handlePlay = useCallback(() => {
    setUserHasPaused(false);
  }, []);

  const handlePause = useCallback(() => {
    if (hasUserClicked) {
      setUserHasPaused(true);
    }
  }, [hasUserClicked]);

  useEffect(() => {
    if (externalPlaying === true) {
      setUserHasPaused(false);
    }
  }, [externalPlaying]);

  const handleVideoClick = useCallback(() => {
    if (hasUserClicked) {
      return;
    }

    const player = playerRef.current;
    if (player) {
      player.currentTime = 0;
      setInternalPlaying(true);
      setHasUserClicked(true);
      setUserHasPaused(false);
    }
  }, [hasUserClicked]);

  return (
    <div style={{ position: "relative", width: width, height: height }}>
      {(urlLoading || !isReady || !revealed) && (
        <Skeleton className="absolute inset-0 z-[5]" />
      )}
      {videoUrl && (
        <ReactPlayer
          ref={setPlayerRef}
          src={videoUrl}
          controls={controls}
          className={`react-player ${className || ""}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover" as const,
            ...style,
          }}
          pip={pip}
          playing={playing}
          volume={volume}
          onDurationChange={handleDuration}
          onReady={handleReady}
          onPlay={handlePlay}
          onPause={handlePause}
        />
      )}
      {!hasUserClicked && videoUrl && (
        <div
          onClick={handleVideoClick}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            cursor: "pointer",
            zIndex: 10,
            pointerEvents: "auto",
          }}
        />
      )}
    </div>
  );
};
