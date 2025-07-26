import { create } from 'zustand';

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
  
  setBackgroundImage: (image: string | null, componentId = 'anonymous') => {
    const state = get();
    
    console.log('🎨 Background change:', { from: state.currentBackground, to: image, componentId });
    
    if (image !== null) {
      // Component is setting a background - add to active users
      activeBackgroundUsers.add(componentId);
      
      // Clear any pending clear for this component
      const existingTimeout = clearTimeouts.get(componentId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        clearTimeouts.delete(componentId);
        console.log('⏹️ Cancelled pending clear for', componentId);
      }
      
      if (image === state.currentBackground) {
        console.log('🔄 Same background, updating users');
        return;
      }
      
      // Setting new background - use dual background technique
      if (state.currentBackground !== null) {
        console.log('🔄 Transitioning backgrounds');
        // Transition from current to new
        set({ 
          nextBackground: image,
          isTransitioning: true 
        });
        
        // Complete transition after image loads
        setTimeout(() => {
          console.log('✅ Transition complete');
          set({ 
            currentBackground: image,
            nextBackground: null,
            isTransitioning: false
          });
        }, 300);
      } else {
        console.log('🆕 Setting first background');
        // First background - set immediately
        set({ 
          currentBackground: image,
          nextBackground: null,
          isTransitioning: false 
        });
      }
    } else {
      // Component is clearing background - remove from active users
      activeBackgroundUsers.delete(componentId);
      console.log('🗑️ Component clearing background:', componentId, 'Active users:', activeBackgroundUsers.size);
      
      // Only clear if no other components are using backgrounds
      if (activeBackgroundUsers.size === 0) {
        console.log('🗑️ Clearing background (delayed) - no active users');
        const timeoutId = setTimeout(() => {
          // Double-check no new users were added
          if (activeBackgroundUsers.size === 0) {
            console.log('🗑️ Actually clearing background');
            set({ 
              currentBackground: null,
              nextBackground: null,
              isTransitioning: false 
            });
          } else {
            console.log('🚫 Not clearing - new users active:', activeBackgroundUsers.size);
          }
          clearTimeouts.delete(componentId);
        }, 100);
        
        clearTimeouts.set(componentId, timeoutId);
      } else {
        console.log('🚫 Not clearing - other components still using background');
      }
    }
  },
}));