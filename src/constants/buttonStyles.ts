export const BUTTON_STYLES = {
  base: "text-xs sm:text-sm md:text-base lg:text-sm font-nord font-thin px-8 py-2.5 sm:py-3 rounded-full inline-flex items-center justify-center transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background text-foreground border border-button-border bg-button-bg hover:bg-button-hover cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  glintOverrides:
    "relative z-20 bg-transparent border-0 w-full h-full !border-transparent hover:bg-button-hover focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer disabled:cursor-not-allowed",
} as const;
