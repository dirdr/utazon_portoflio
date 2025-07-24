import { create } from 'zustand';

interface BackgroundStore {
  backgroundImage: string | null;
  isTransitioning: boolean;
  setBackgroundImage: (image: string | null) => void;
}

export const useBackgroundStore = create<BackgroundStore>((set, get) => ({
  backgroundImage: null,
  isTransitioning: false,
  
  setBackgroundImage: (image: string | null) => {
    const currentImage = get().backgroundImage;
    
    if (image === currentImage) return;
    
    set({ 
      backgroundImage: image, 
      isTransitioning: false 
    });
  },
}));