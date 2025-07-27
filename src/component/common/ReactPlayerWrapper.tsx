import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";

interface ReactPlayerWrapperProps {
  src: string;
  light?: string | boolean;
  className?: string;
}

export const ReactPlayerWrapper = ({
  src,
  light,
  className,
}: ReactPlayerWrapperProps) => {
  const [userActive, setUserActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);
  const timeoutRef = useRef<number>();

  const resetInactivityTimer = () => {
    setUserActive(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setUserActive(false);
    }, 3000);
  };

  const handleUserActivity = () => {
    resetInactivityTimer();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClickPreview = () => {
    setIsPlaying(true);
    resetInactivityTimer();
  };

  const handlePlay = () => {
    setIsPlaying(true);
    resetInactivityTimer();
  };

  const handlePause = () => {
    setIsPlaying(false);
    resetInactivityTimer();
  };

  return (
    <div
      className={className}
      onMouseMove={handleUserActivity}
      onMouseEnter={handleUserActivity}
      onClick={handleUserActivity}
    >
      <ReactPlayer
        ref={playerRef}
        src={src}
        width="100%"
        height="100%"
        controls={userActive && isPlaying}
        playing={isPlaying}
        autoPlay={false}
        muted={false}
        loop={true}
        light={light}
        onClickPreview={handleClickPreview}
        onPlay={handlePlay}
        onPause={handlePause}
        onError={(error) => console.error("Video error:", error)}
      />
    </div>
  );
};
