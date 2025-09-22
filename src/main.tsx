import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AppLoadingProvider } from "./contexts/AppLoadingContext";
import { CursorTrailProvider } from "./contexts/CursorTrailProvider";
import { GlobalLoaderWrapper } from "./component/app/GlobalLoaderWrapper";
import "./index.css";
import "./i18n";

// Set CSS custom property for real viewport height on mobile
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Enhanced viewport height management for better mobile transition support
function initializeViewportHeight() {
  setViewportHeight();

  // Update on resize with debouncing for performance
  let resizeTimeout: number;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(setViewportHeight, 16);
  };

  window.addEventListener('resize', debouncedResize);

  // Handle orientation changes with multiple checks for mobile browser reliability
  window.addEventListener('orientationchange', () => {
    // Immediate update
    setViewportHeight();
    // Follow-up updates to catch browser UI animations
    setTimeout(setViewportHeight, 100);
    setTimeout(setViewportHeight, 300);
    setTimeout(setViewportHeight, 500);
  });

  // Handle scroll events that might trigger mobile browser UI changes
  let scrollTimeout: number;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = window.setTimeout(setViewportHeight, 100);
  }, { passive: true });

  // Handle focus events that might change mobile browser UI
  window.addEventListener('focusin', setViewportHeight);
  window.addEventListener('focusout', () => {
    setTimeout(setViewportHeight, 100);
  });
}

// Initialize enhanced viewport height management
initializeViewportHeight();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppLoadingProvider>
      <CursorTrailProvider>
        <GlobalLoaderWrapper>
          <App />
        </GlobalLoaderWrapper>
      </CursorTrailProvider>
    </AppLoadingProvider>
  </React.StrictMode>,
);
