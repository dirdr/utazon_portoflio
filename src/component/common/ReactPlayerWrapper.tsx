import ReactPlayer from "react-player";
import React, { useState, useRef } from "react";

interface ReactPlayerWrapperProps {
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

export const ReactPlayerWrapper = ({
  src,
  width = "100%",
  height = "100%",
  controls = true,
  className,
  style,
  pip = false,
  playing: externalPlaying,
  volume = 0.8,
  startTime,
}: ReactPlayerWrapperProps) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const playerRef = useRef<ReactPlayer>(null);
  const playing = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  // Create the source URL with time fragment for initial load
  const sourceUrl = React.useMemo(() => {
    if (startTime && startTime > 0) {
      // For HTML video time fragments, format properly
      // Support both integer and fractional seconds
      const timeFragment = startTime % 1 === 0 
        ? `${startTime}` 
        : startTime.toFixed(1);
      return `${src}#t=${timeFragment}`;
    }
    return src;
  }, [src, startTime]);

  const handleClickPreview = () => {
    setInternalPlaying(true);
    if (hasClicked && playerRef.current) {
      // Use v3 API - seekTo method to restart from beginning
      playerRef.current.seekTo(0);
    }
    setHasClicked(true);
  };

  const handleReady = () => {
    // After first interaction, remove time fragment for future seeks
    if (hasClicked && playerRef.current && startTime) {
      playerRef.current.seekTo(0);
    }
  };

  return (
    <ReactPlayer
      ref={playerRef}
      src={sourceUrl}
      width={width}
      height={height}
      controls={controls}
      className={className}
      style={style}
      pip={pip}
      playing={playing}
      volume={volume}
      onClickPreview={handleClickPreview}
      onReady={handleReady}
    />
  );
};

