import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AppLoadingProvider } from "./contexts/AppLoadingContext";
import { CursorTrailProvider } from "./contexts/CursorTrailProvider";
import { GlobalLoaderWrapper } from "./component/app/GlobalLoaderWrapper";
import "./index.css";
import "./i18n";

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
