export const ANIMATION_CONFIG = {
  FADE_IN_DELAY: 2000, // Wait 2 seconds after video starts
  FADE_IN_DURATION: 1000, // 1 second fade-in duration
  FADE_IN_EASING: 'ease-out',
} as const;

export const ANIMATION_CLASSES = {
  HIDDEN: 'opacity-0 translate-y-4',
  VISIBLE: 'opacity-100 translate-y-0',
  TRANSITION: 'transition-all duration-1000 ease-out',
} as const;