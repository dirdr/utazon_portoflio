import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface OverlayManagerProps {
  children: React.ReactNode;
}

/**
 * OverlayManager provides a consistent portal-based rendering solution
 * for overlay elements to ensure proper z-index stacking across the app.
 * 
 * This follows the industry standard pattern used by UI libraries like
 * Headless UI, Radix UI, and Mantine to avoid stacking context issues.
 */
export const OverlayManager = ({ children }: OverlayManagerProps) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create a dedicated overlay container if it doesn't exist
    let container = document.getElementById('overlay-root');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'overlay-root';
      container.className = 'overlay-manager';
      // Insert at the end of body to ensure it's above other content
      document.body.appendChild(container);
    }

    setPortalContainer(container);

    return () => {
      // Clean up empty container on unmount if no other overlays are using it
      if (container && container.children.length === 0) {
        container.remove();
      }
    };
  }, []);

  if (!portalContainer) {
    return null;
  }

  return createPortal(children, portalContainer);
};

/**
 * Z-index design system for consistent overlay layering
 */
export const OVERLAY_Z_INDEX = {
  VIDEO_BACKGROUND: -20,
  VIDEO_GRADIENT: 10,
  CURSOR_TRAIL: 1000,
  MODAL_BACKDROP: 2000,
  DIVE_IN_BUTTON_CONTAINER: 3000,
  DIVE_IN_BUTTON_ELEMENT: 3001,
  MODAL_CONTENT: 4000,
  TOOLTIP: 5000,
} as const;