import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";

interface ModalProps {
  isOpen: boolean;
  isClosing?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  isClosing = false,
  onClose,
  children,
  className,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose, closeOnEscape]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;

      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: OVERLAY_Z_INDEX.CONTACT_MODAL }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={cn(
        "absolute inset-0 bg-black/50",
        isClosing ? "animate-modal-backdrop-out" : "animate-modal-backdrop-in"
      )} />

      <div
        ref={modalRef}
        className={cn(
          "relative z-10 w-full max-w-3xl max-h-[80vh]",
          "bg-background rounded-2xl shadow-2xl",
          "flex flex-col overflow-hidden",
          isClosing ? "animate-modal-slide-up-out" : "animate-modal-slide-up-in",
          className,
        )}
        style={{ border: '1px solid #565656' }}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

