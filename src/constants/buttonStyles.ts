export const BUTTON_STYLES = {
  shared:
    "font-nord px-10 py-4 rounded-full inline-flex items-center justify-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background text-foreground",
  standard: "border border-button-border bg-button-bg hover:bg-button-hover",
  glint:
    "relative overflow-hidden border border-button-border bg-[conic-gradient(from_0deg,transparent_270deg,rgba(255,255,255,0.4),transparent)] p-1 hover:bg-[conic-gradient(from_0deg,transparent_270deg,rgba(255,255,255,0.6),transparent)]",
  disabled:
    "opacity-50 cursor-not-allowed hover:text-foreground hover:bg-button-bg",
} as const;
