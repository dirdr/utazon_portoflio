import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { cn } from "../../utils/cn";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPlaying) {
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    }
  }, [initialPlaying]);

  const handleToggle = useCallback(() => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);

    if (newPlayingState) {
      setIsAnimating(false);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    } else {
      setIsAnimating(false);
    }

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

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const tooltipText = isPlaying
    ? t("soundPlayer.mute")
    : t("soundPlayer.unmute");
  const ariaLabel = tooltipText;

  const barsConfig = useMemo(
    () => [
      { animationClass: "animate-sound-wave-1", delay: 0 },
      { animationClass: "animate-sound-wave-2", delay: 0.15 },
      { animationClass: "animate-sound-wave-3", delay: 0.3 },
      { animationClass: "animate-sound-wave-4", delay: 0.45 },
      { animationClass: "animate-sound-wave-5", delay: 0.6 },
    ],
    [],
  );

  return (
    <div className="relative inline-block w-fit">
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "group relative",
          "bg-transparent border border-white/20",
          "rounded-full px-4 py-2 sm:px-6 sm:py-3",
          "transition-all duration-300 ease-out",
          "focus:outline-none",
          className,
        )}
        aria-label={ariaLabel}
        aria-pressed={isPlaying}
        aria-describedby="sound-player-tooltip"
        type="button"
        role="button"
        tabIndex={0}
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div
          className="relative flex items-center justify-center gap-0.5 w-8 h-3 sm:gap-1 sm:w-10 sm:h-4"
          aria-hidden="true"
        >
          {barsConfig.map((bar, index) => (
            <div
              key={index}
              ref={(el) => (barsRef.current[index] = el)}
              className={cn(
                "h-2 md:h-4 bg-white rounded-full transform-gpu",
                !isPlaying && "scale-y-[0.2]",
                isPlaying && isAnimating && "animate-sound-wave",
              )}
              style={{
                width: "3px",
                animationDelay:
                  isPlaying && isAnimating ? `${bar.delay}s` : undefined,
                transform:
                  isPlaying && !isAnimating ? "scaleY(0.2)" : undefined,
              }}
              role="presentation"
            />
          ))}
        </div>

        {isHovered && (
          <div
            ref={tooltipRef}
            id="sound-player-tooltip"
            className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-white text-sm whitespace-nowrap pointer-events-none font-nord"
            style={{
              fontWeight: 100,
              zIndex: OVERLAY_Z_INDEX.TOOLTIP,
            }}
            role="tooltip"
          >
            {tooltipText}
          </div>
        )}
      </button>
    </div>
  );
};
