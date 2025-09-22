/**
 * Z-index design system for consistent overlay layering
 */
export const OVERLAY_Z_INDEX = {
  VIDEO_BACKGROUND: -20,
  VIDEO_GRADIENT: 5,
  // Home content uses z-10 in HomeContainer.tsx
  CURSOR_TRAIL: 500,
  MODAL_BACKDROP: 2000,
  CONTACT_MODAL: 2500,
  PAGE_TRANSITION_OVERLAY: 2750,
  DIVE_IN_BUTTON_CONTAINER: 3000,
  DIVE_IN_BUTTON_ELEMENT: 3001,
  MODAL_CONTENT: 4000,
  GLOBAL_LOADER: 4500,
  TOOLTIP: 5000,
} as const;

