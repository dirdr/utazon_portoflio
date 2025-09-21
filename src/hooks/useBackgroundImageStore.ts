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
  setBackground: (config: BackgroundConfig | null, componentId?: string, route?: string) => void;
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

    setBackground: (config: BackgroundConfig | null, componentId = "anonymous", route?: string) => {
      const state = get();

      if (config !== null) {
        // Skip Three.js background processing for non-about routes
        if (config.type === 'three' && route && route !== '/about') {
          return;
        }

        activeBackgroundUsers.add(componentId);

        const existingTimeout = clearTimeouts.get(componentId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
          clearTimeouts.delete(componentId);
        }

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

          setTimeout(() => {
            set({
              currentBackground: config,
              nextBackground: null,
              isTransitioning: false,
            });
          }, 300);
        } else {
          set({
            currentBackground: config,
            nextBackground: null,
            isTransitioning: false,
          });
        }
      } else {
        activeBackgroundUsers.delete(componentId);

        if (activeBackgroundUsers.size === 0) {
          const timeoutId = setTimeout(() => {
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
