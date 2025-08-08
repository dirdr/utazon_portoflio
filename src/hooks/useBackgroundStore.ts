import { create } from "zustand";

interface BackgroundStore {
  currentBackground: string | null;
  nextBackground: string | null;
  isTransitioning: boolean;
  setBackgroundImage: (image: string | null, componentId?: string) => void;
}

const activeBackgroundUsers = new Set<string>();
const clearTimeouts = new Map<string, number>();

export const useBackgroundStore = create<BackgroundStore>((set, get) => ({
  currentBackground: null,
  nextBackground: null,
  isTransitioning: false,

  setBackgroundImage: (image: string | null, componentId = "anonymous") => {
    const state = get();

    if (image !== null) {
      // Component is setting a background - add to active users
      activeBackgroundUsers.add(componentId);

      // Clear any pending clear for this component
      const existingTimeout = clearTimeouts.get(componentId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        clearTimeouts.delete(componentId);
      }

      if (image === state.currentBackground) {
        return;
      }

      // Setting new background - use dual background technique
      if (state.currentBackground !== null) {
        // Transition from current to new
        set({
          nextBackground: image,
          isTransitioning: true,
        });

        // Complete transition after CSS transition duration
        setTimeout(() => {
          set({
            currentBackground: image,
            nextBackground: null,
            isTransitioning: false,
          });
        }, 500);
      } else {
        // First background - set immediately
        set({
          currentBackground: image,
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

        clearTimeouts.set(componentId, timeoutId);
      }
    }
  },
}));

