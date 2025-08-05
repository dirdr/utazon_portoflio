import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';

interface HomePageState {
  // Core workflow state
  isFirstLoad: boolean;
  showDiveInButton: boolean;
  showContent: boolean;
  isVideoPlaying: boolean;
  
  // Derived state
  shouldJumpToEightSeconds: boolean;
}

interface HomePageContextValue extends HomePageState {
  // Actions
  handleDiveInClick: () => void;
  handleVideoStart: () => void;
  handleContentShow: () => void;
}

const HomePageContext = createContext<HomePageContextValue | null>(null);

export const useHomePage = (): HomePageContextValue => {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error('useHomePage must be used within HomePageProvider');
  }
  return context;
};

// Simple session storage key to detect fresh loads vs SPA navigation
const FRESH_LOAD_KEY = 'homepage_visited';

interface HomePageProviderProps {
  children: React.ReactNode;
}

export const HomePageProvider: React.FC<HomePageProviderProps> = ({ children }) => {
  const [location] = useLocation();
  const isHomePage = location === '/';
  
  // Determine if this is a fresh load or SPA navigation
  const [isFirstLoad] = useState(() => {
    if (!isHomePage) return false;
    
    const hasVisited = sessionStorage.getItem(FRESH_LOAD_KEY);
    if (!hasVisited) {
      sessionStorage.setItem(FRESH_LOAD_KEY, 'true');
      return true;
    }
    return false;
  });
  
  // State management
  const [showDiveInButton, setShowDiveInButton] = useState(isFirstLoad && isHomePage);
  const [showContent, setShowContent] = useState(!isFirstLoad && isHomePage);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  // Handle SPA navigation to home page
  useEffect(() => {
    if (isHomePage && !isFirstLoad) {
      // SPA navigation: show content immediately, no dive-in button
      setShowDiveInButton(false);
      setShowContent(true);
      setIsVideoPlaying(false);
    } else if (!isHomePage) {
      // Leaving home page: reset video state
      setIsVideoPlaying(false);
      setShowContent(false);
    }
  }, [isHomePage, isFirstLoad]);
  
  // Actions
  const handleDiveInClick = useCallback(() => {
    console.log('🎬 Dive in button clicked');
    setShowDiveInButton(false);
  }, []);
  
  const handleVideoStart = useCallback(() => {
    console.log('🎬 Video started playing');
    setIsVideoPlaying(true);
    
    // For fresh loads, show content after 3 seconds
    if (isFirstLoad) {
      setTimeout(() => {
        console.log('🎬 Showing content after video delay');
        setShowContent(true);
      }, 3000);
    }
  }, [isFirstLoad]);
  
  const handleContentShow = useCallback(() => {
    console.log('🎬 Content shown');
    setShowContent(true);
  }, []);
  
  // Debug logging
  useEffect(() => {
    console.log('🏠 HomePageContext state:', {
      location,
      isHomePage,
      isFirstLoad,
      showDiveInButton,
      showContent,
      isVideoPlaying,
      shouldJumpToEightSeconds: !isFirstLoad && isHomePage
    });
  }, [location, isHomePage, isFirstLoad, showDiveInButton, showContent, isVideoPlaying]);
  
  const value: HomePageContextValue = {
    // State
    isFirstLoad,
    showDiveInButton: showDiveInButton && isHomePage,
    showContent: showContent && isHomePage,
    isVideoPlaying,
    shouldJumpToEightSeconds: !isFirstLoad && isHomePage,
    
    // Actions
    handleDiveInClick,
    handleVideoStart,
    handleContentShow,
  };
  
  return (
    <HomePageContext.Provider value={value}>
      {children}
    </HomePageContext.Provider>
  );
};