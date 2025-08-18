import React, { useState, useCallback, useMemo } from "react";
import { cn } from "../../utils/cn";

export interface SoundPlayerProps {
  className?: string;
  onToggle?: (isPlaying: boolean) => void;
  initialPlaying?: boolean;
}

export const SoundPlayer: React.FC<SoundPlayerProps> = ({
  className,
  onToggle,
  initialPlaying = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(initialPlaying);

  const handleToggle = useCallback(() => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    onToggle?.(newPlayingState);
  }, [isPlaying, onToggle]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  const barsConfig = useMemo(
    () => [
      { animationClass: "animate-sound-wave-1" },
      { animationClass: "animate-sound-wave-2" },
      { animationClass: "animate-sound-wave-3" },
      { animationClass: "animate-sound-wave-4" },
      { animationClass: "animate-sound-wave-5" },
    ],
    [],
  );

  return (
    <button
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={cn(
        "group relative",
        "bg-transparent border border-white/20",
        "rounded-full px-6 py-3",
        "transition-all duration-300 ease-out",
        className,
      )}
      aria-label={isPlaying ? "Mute sound" : "Unmute sound"}
      aria-pressed={isPlaying}
      type="button"
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-center justify-center gap-1 w-6 h-4">
        {barsConfig.map((bar, index) => (
          <div
            key={index}
            className={cn(
              "w-4 h-4 bg-white rounded-full transition-all duration-300",
              "origin-center",
              !isPlaying && ["scale-y-[0.25] opacity-60"],
              isPlaying && ["opacity-90", bar.animationClass],
            )}
          />
        ))}
      </div>
    </button>
  );
};

