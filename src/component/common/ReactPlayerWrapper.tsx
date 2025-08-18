import ReactPlayer from "react-player";
import React, { useState } from "react";

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
  const playing = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  // Create the source URL with time fragment for HTML video
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
  };

  return (
    <ReactPlayer
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
    />
  );
};

