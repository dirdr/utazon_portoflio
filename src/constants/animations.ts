export const ANIMATION_CONFIG = {
  FADE_IN_DELAY: 2000,
} as const;

export const ANIMATION_CLASSES = {
  HIDDEN: "opacity-0 translate-y-4",
  VISIBLE: "opacity-100 translate-y-0",
  TRANSITION: "transition-all duration-1000 ease-out",
} as const;
