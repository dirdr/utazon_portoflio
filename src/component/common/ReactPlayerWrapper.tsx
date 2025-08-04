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
}: ReactPlayerWrapperProps) => {
  const [playing, setPlaying] = useState(false);

  const handleClickPreview = () => {
    setPlaying(true);
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
      onClickPreview={handleClickPreview}
    />
  );
};

