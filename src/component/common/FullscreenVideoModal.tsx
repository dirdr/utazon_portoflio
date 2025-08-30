import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ReactPlayerWrapper } from "./ReactPlayerWrapper";
import { apiClient } from "../../services/api";

interface FullscreenVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenVideoModal = ({
  isOpen,
  onClose,
}: FullscreenVideoModalProps) => {
  const videoUrl = apiClient.getVideoUrl("showreel.mp4");

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black"
      onClick={handleBackdropClick}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 text-white hover:text-gray-300 transition-colors p-3 rounded-full bg-black/50 hover:bg-black/70"
        aria-label="Close video (ESC)"
        title="Close video (ESC)"
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
      
      <div className="w-full h-full">
        <ReactPlayerWrapper
          src={videoUrl}
          width="100%"
          height="100%"
          controls
          pip={false}
          playing
          volume={1}
        />
      </div>
    </div>,
    document.body
  );
};