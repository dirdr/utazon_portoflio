import { create } from "zustand";

export type BackgroundType = 'image' | 'three';

export interface BackgroundConfig {
  type: BackgroundType;
  value: string | null; // image URL for 'image' type, identifier for 'three' type
  options?: {
    planeOpaque?: boolean;
    bloomEnabled?: boolean;
  };
}

interface BackgroundImageStore {
  currentBackground: BackgroundConfig | null;
  nextBackground: BackgroundConfig | null;
  isTransitioning: boolean;
  setBackgroundImage: (image: string | null, componentId?: string) => void;
  setBackground: (config: BackgroundConfig | null, componentId?: string) => void;
}

const activeBackgroundUsers = new Set<string>();
const clearTimeouts = new Map<string, number>();

export const useBackgroundImageStore = create<BackgroundImageStore>(
  (set, get) => ({
    currentBackground: null,
    nextBackground: null,
    isTransitioning: false,

    setBackgroundImage: (image: string | null, componentId = "anonymous") => {
      const config: BackgroundConfig | null = image
        ? { type: 'image', value: image }
        : null;

      get().setBackground(config, componentId);
    },

    setBackground: (config: BackgroundConfig | null, componentId = "anonymous") => {
      const state = get();

      if (config !== null) {
        // Component is setting a background - add to active users
        activeBackgroundUsers.add(componentId);

        // Clear any pending clear for this component
        const existingTimeout = clearTimeouts.get(componentId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          clearTimeouts.delete(componentId);
        }

        // Check if the new config is the same as current
        const isSameBackground = state.currentBackground &&
          state.currentBackground.type === config.type &&
          state.currentBackground.value === config.value;

        if (isSameBackground) {
          return;
        }

        if (state.currentBackground !== null) {
          set({
            nextBackground: config,
            isTransitioning: true,
          });

          // Complete transition after CSS transition duration
          setTimeout(() => {
            set({
              currentBackground: config,
              nextBackground: null,
              isTransitioning: false,
            });
          }, 300);
        } else {
          // First background - set immediately
          set({
            currentBackground: config,
            nextBackground: null,
            isTransitioning: false,
          });
        }
      } else {
        // Component is clearing background - remove from active users
        activeBackgroundUsers.delete(componentId);

        // Only clear if no other components are using backgrounds
        if (activeBackgroundUsers.size === 0) {
          const timeoutId = setTimeout(() => {
            // Double-check no new users were added
            if (activeBackgroundUsers.size === 0) {
              set({
                currentBackground: null,
                nextBackground: null,
                isTransitioning: false,
              });
            }
            clearTimeouts.delete(componentId);
          }, 100);

          clearTimeouts.set(componentId, timeoutId as unknown as number);
        }
      }
    },
  }),
);
