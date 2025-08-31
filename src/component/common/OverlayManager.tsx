import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

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
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    let container = document.getElementById("overlay-root");

    if (!container) {
      container = document.createElement("div");
      container.id = "overlay-root";
      container.className = "overlay-manager";
      document.body.appendChild(container);
    }

    setPortalContainer(container);

    return () => {
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
