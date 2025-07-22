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
    
    // Set the image immediately and handle transition in CSS
    set({ 
      backgroundImage: image, 
      isTransitioning: false 
    });
  },
}));