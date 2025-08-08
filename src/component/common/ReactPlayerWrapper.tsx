import ReactPlayer from "react-player";
import { useState } from "react";

interface ReactPlayerWrapperProps {
  src: string;
  width?: string | number;
  height?: string | number;
  light?: string | boolean;
  controls?: boolean;
  className?: string;
  style?: React.CSSProperties;
  pip?: boolean;
  playing?: boolean;
  volume?: number;
}

export const ReactPlayerWrapper = ({
  src,
  width = "100%",
  height = "100%",
  light = false,
  controls = true,
  className,
  style,
  pip = false,
  playing: externalPlaying,
  volume = 0.8,
}: ReactPlayerWrapperProps) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const playing = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  const handleClickPreview = () => {
    setInternalPlaying(true);
  };

  return (
    <ReactPlayer
      src={src}
      width={width}
      height={height}
      light={!playing ? light : false}
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

