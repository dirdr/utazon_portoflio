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

// Set on load
setViewportHeight();

// Update on resize (including orientation change)
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', () => {
  setTimeout(setViewportHeight, 100);
});

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
