import { useLocation } from "wouter";
import { useDiveInInitialization } from "../../hooks/useDiveInInitialization";
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
    hideDiveInButton
  } = useDiveInInitialization();
  
  console.log('🏃 AppWithDiveIn render:', { 
    location, 
    isHomePage, 
    showDiveInButton,
    willShowDiveIn: isHomePage && showDiveInButton
  });

  const handleDiveIn = () => {
    console.log('🚀 User clicked Dive In - starting experience');
    hideDiveInButton();
    
    // Small delay to ensure state update, then trigger video
    setTimeout(() => {
      if ((window as any).startHomeVideo) {
        (window as any).startHomeVideo();
      }
    }, 100);
  };

  // Show DiveInButton overlay if:
  // 1. We're on home page AND
  // 2. showDiveInButton is true (fresh load detected, same logic as global loader)
  if (isHomePage && showDiveInButton) {
    return <DiveInButton onDiveIn={handleDiveIn} />;
  }

  // Otherwise render the full app
  return <AppContent />;
};