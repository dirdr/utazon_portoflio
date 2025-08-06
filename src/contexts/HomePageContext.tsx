import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "wouter";

interface HomePageState {
  isFirstLoad: boolean;
  showDiveInButton: boolean;
  showContent: boolean;
  isVideoPlaying: boolean;

  shouldJumpToEightSeconds: boolean;
}

interface HomePageContextValue extends HomePageState {
  handleDiveInClick: () => void;
  handleVideoStart: () => void;
  handleContentShow: () => void;
}

const HomePageContext = createContext<HomePageContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useHomePage = (): HomePageContextValue => {
  const context = useContext(HomePageContext);
  if (!context) {
    throw new Error("useHomePage must be used within HomePageProvider");
  }
  return context;
};

const FRESH_LOAD_KEY = "homepage_visited";

interface HomePageProviderProps {
  children: React.ReactNode;
}

export const HomePageProvider: React.FC<HomePageProviderProps> = ({
  children,
}) => {
  const [location] = useLocation();
  const isHomePage = location === "/";

  const [isFirstLoad] = useState(() => {
    if (!isHomePage) return false;

    const hasVisited = sessionStorage.getItem(FRESH_LOAD_KEY);
    if (!hasVisited) {
      sessionStorage.setItem(FRESH_LOAD_KEY, "true");
      return true;
    }
    return false;
  });

  const [showDiveInButton, setShowDiveInButton] = useState(
    isFirstLoad && isHomePage,
  );
  const [showContent, setShowContent] = useState(!isFirstLoad && isHomePage);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (isHomePage && !isFirstLoad) {
      setShowDiveInButton(false);
      setShowContent(true);
      setIsVideoPlaying(false);
    } else if (!isHomePage) {
      setIsVideoPlaying(false);
      setShowContent(false);
    }
  }, [isHomePage, isFirstLoad]);

  const handleDiveInClick = useCallback(() => {
    console.log("🎬 Dive in button clicked");
    setShowDiveInButton(false);
  }, []);

  const handleVideoStart = useCallback(() => {
    console.log("🎬 Video started playing");
    setIsVideoPlaying(true);

    if (isFirstLoad) {
      setTimeout(() => {
        console.log("🎬 Showing content after video delay");
        setShowContent(true);
      }, 3000);
    }
  }, [isFirstLoad]);

  const handleContentShow = useCallback(() => {
    console.log("🎬 Content shown");
    setShowContent(true);
  }, []);

  useEffect(() => {
    console.log("🏠 HomePageContext state:", {
      location,
      isHomePage,
      isFirstLoad,
      showDiveInButton,
      showContent,
      isVideoPlaying,
      shouldJumpToEightSeconds: !isFirstLoad && isHomePage,
    });
  }, [
    location,
    isHomePage,
    isFirstLoad,
    showDiveInButton,
    showContent,
    isVideoPlaying,
  ]);

  const value: HomePageContextValue = {
    isFirstLoad,
    showDiveInButton: showDiveInButton && isHomePage,
    showContent: showContent && isHomePage,
    isVideoPlaying,
    shouldJumpToEightSeconds: !isFirstLoad && isHomePage,

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

