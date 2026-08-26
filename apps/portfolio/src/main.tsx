import ReactDOM from "react-dom/client";
import { ReactLenis } from "lenis/react";
import App from "./App.tsx";
import { AppLoadingProvider } from "./contexts/AppLoadingContext";
import { CursorTrailProvider } from "./contexts/CursorTrailProvider";
import { CanvasReadinessProvider } from "./contexts/CanvasReadinessProvider";
import { GlobalLoaderWrapper } from "./component/app/GlobalLoaderWrapper";
import "./index.css";
import "./i18n";

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

function initializeViewportHeight() {
  setViewportHeight();

  let resizeTimeout: number;
  const debouncedResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(setViewportHeight, 16);
  };

  window.addEventListener("resize", debouncedResize);

  window.addEventListener("orientationchange", () => {
    setViewportHeight();
    setTimeout(setViewportHeight, 100);
    setTimeout(setViewportHeight, 300);
    setTimeout(setViewportHeight, 500);
  });

  let scrollTimeout: number;
  window.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(setViewportHeight, 100);
    },
    { passive: true },
  );

  window.addEventListener("focusin", setViewportHeight);
  window.addEventListener("focusout", () => {
    setTimeout(setViewportHeight, 100);
  });
}

initializeViewportHeight();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <ReactLenis
    root
    options={{
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
    }}
  >
    <AppLoadingProvider>
      <CursorTrailProvider>
        <CanvasReadinessProvider>
          <GlobalLoaderWrapper>
            <App />
          </GlobalLoaderWrapper>
        </CanvasReadinessProvider>
      </CursorTrailProvider>
    </AppLoadingProvider>
  </ReactLenis>,
);
