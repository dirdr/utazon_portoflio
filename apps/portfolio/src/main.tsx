import ReactDOM from "react-dom/client";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
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
      // lenis 1.3.26 began honouring prefers-reduced-motion by default, which
      // routes user scroll through scrollTo with lerp 1 and drops the easing.
      // Motion is the point of this site, so it opts out deliberately rather
      // than degrading to an instant-jump scroll.
      respectReducedMotion: false,
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
