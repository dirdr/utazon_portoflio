import { useLocation } from "wouter";
import { useAppState } from "../../hooks/useAppState";
import { DiveInButton } from "../common/DiveInButton";
import { AppContent } from "./AppContent";
import { ROUTES } from "../../constants/routes";

/**
 * Component that handles the "Dive In" overlay logic
 * Shows only the DiveInButton on fresh home page loads (mirroring AppWrapper pattern)
 * Renders full app content after user interaction or on other pages
 */
export const AppWithDiveIn = () => {
  const [location] = useLocation();
  const isHomePage = location === ROUTES.HOME;
  
  const { 
    showDiveInButton,
    hideDiveInButton,
    isFirstLoad,
    shouldPlayFromStart,
    preloadComplete
  } = useAppState();

  console.log("🔍 AppWithDiveIn render:", {
    location,
    isHomePage,
    showDiveInButton,
    isFirstLoad,
    preloadComplete,
    shouldPlayFromStart,
    timestamp: Date.now()
  });

  const handleDiveIn = () => {
    console.log("🔘 DiveIn button clicked - hiding button and starting video");
    hideDiveInButton();
    
    // Small delay to ensure state update, then trigger video
    setTimeout(() => {
      const windowWithVideo = window as Window & { startHomeVideo?: () => void };
      if (windowWithVideo.startHomeVideo) {
        console.log("🔘 Calling startHomeVideo function");
        windowWithVideo.startHomeVideo();
      } else {
        console.error("🔘 startHomeVideo function not found!");
      }
    }, 100);
  };

  // Show DiveInButton overlay if:
  // 1. We're on home page AND
  // 2. This should play from start (fresh load) AND
  // 3. Dive button is active
  const shouldShowDiveIn = isHomePage && shouldPlayFromStart && showDiveInButton;
  
  console.log("🔍 AppWithDiveIn decision:", {
    shouldShowDiveIn,
    calculation: `${isHomePage} && ${shouldPlayFromStart} && ${showDiveInButton}`,
    result: shouldShowDiveIn ? "SHOWING DIVE-IN" : "SHOWING APP CONTENT"
  });
  
  if (shouldShowDiveIn) {
    return <DiveInButton onDiveIn={handleDiveIn} isReady={preloadComplete} />;
  }

  // Otherwise render the full app
  return <AppContent />;
};