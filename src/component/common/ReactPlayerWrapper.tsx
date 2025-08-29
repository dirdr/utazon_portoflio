import ReactPlayer from "react-player";
import React, { useState, useRef, useCallback } from "react";

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
  startTime = 2,
}: ReactPlayerWrapperProps) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [hasUserClicked, setHasUserClicked] = useState(false);
  const playerRef = useRef<HTMLVideoElement | null>(null);

  const playing = externalPlaying ?? internalPlaying;

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
  }, []);

  const handleReady = useCallback(() => {
    // Video ready callback
  }, []);

  const handleDuration = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    
    if (!hasUserClicked && startTime > 0 && player.duration) {
      player.currentTime = startTime;
    }
  }, [hasUserClicked, startTime]);

  const handleVideoClick = useCallback(() => {
    if (hasUserClicked) {
      return;
    }
    
    const player = playerRef.current;
    if (player) {
      player.currentTime = 0;
      setInternalPlaying(true);
      setHasUserClicked(true);
    }
  }, [hasUserClicked]);

  return (
    <div style={{ position: 'relative', width: width, height: height }}>
      <ReactPlayer
        ref={setPlayerRef}
        src={src}
        width={width}
        height={height}
        controls={controls}
        className={className}
        style={style}
        pip={pip}
        playing={playing}
        volume={volume}
        onDurationChange={handleDuration}
        onCanPlay={handleReady}
      />
      {!hasUserClicked && (
        <div
          onClick={handleVideoClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
            cursor: 'pointer',
            zIndex: 10,
            pointerEvents: 'auto'
          }}
        />
      )}
    </div>
  );
};

