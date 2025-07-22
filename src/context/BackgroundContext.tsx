import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface BackgroundContextType {
  backgroundImage: string | null;
  setBackgroundImage: (image: string | null) => void;
  isTransitioning: boolean;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider = ({ children }: BackgroundProviderProps) => {
  const [backgroundImage, setBackgroundImageState] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setBackgroundImage = useCallback((image: string | null) => {
    if (image === backgroundImage) return;
    
    setIsTransitioning(true);
    
    // Start transition
    setTimeout(() => {
      setBackgroundImageState(image);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50); // Quick transition for smooth effect
    }, 200); // Allow fade out
  }, [backgroundImage]);

  return (
    <BackgroundContext.Provider 
      value={{ 
        backgroundImage, 
        setBackgroundImage, 
        isTransitioning 
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
};