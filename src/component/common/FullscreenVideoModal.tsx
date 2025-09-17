import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { InteractiveVideoPlayer } from "./InteractiveVideoPlayer";
import { getVideoUrl } from "../../utils/videoUrl";

// Audio configuration constants following React best practices
const AUDIO_CONFIG = {
  HOME_VIDEO_VOLUME: 0.5, // 50% of original volume as requested
} as const;

interface FullscreenVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenVideoModal = ({
  isOpen,
  onClose,
}: FullscreenVideoModalProps) => {
  const videoUrl = getVideoUrl("showreel.mp4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setIsPlaying(false);
    
    // Small delay to ensure video stops before closing
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 100);
  }, [onClose]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    },
    [handleClose]
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCloseButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      document.addEventListener("keydown", handleEscape);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    } else {
      setIsPlaying(false);
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black"
      onClick={handleBackdropClick}
      style={{ touchAction: 'none' }}
    >
      <button
        onClick={handleCloseButtonClick}
        className="absolute top-6 right-6 z-20 text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/50 hover:bg-black/70"
        aria-label="Close video (ESC)"
        title="Close video (ESC)"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div className="w-full h-full" style={{ touchAction: 'manipulation' }}>
        <InteractiveVideoPlayer
          src={videoUrl}
          width="100%"
          height="100%"
          controls
          pip={false}
          playing={isPlaying && !isClosing}
          volume={AUDIO_CONFIG.HOME_VIDEO_VOLUME}
        />
      </div>
    </div>,
    document.body
  );
};