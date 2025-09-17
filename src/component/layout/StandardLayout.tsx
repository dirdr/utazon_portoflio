import { ReactNode, useState, useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { ThreeBackgroundDisplay } from "./ThreeBackgroundDisplay";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useLocation } from "wouter";
import { getPageConfig } from "../../config/pageConfig";
import { isModelPreloaded } from "../../hooks/usePreloadAssets";

interface StandardLayoutProps {
  children: ReactNode;
  className?: string;
}

export const StandardLayout = ({
  children,
  className = "",
}: StandardLayoutProps) => {
  const [location] = useLocation();
  const pageConfig = getPageConfig(location);
  const { currentBackground } = useBackgroundImageStore();
  const [shouldShowThreeBackground, setShouldShowThreeBackground] = useState(false);

  useEffect(() => {
    if (currentBackground?.type === 'three') {
      const checkModel = () => {
        if (isModelPreloaded("/models/logo4.glb")) {
          setShouldShowThreeBackground(true);
        } else {
          const interval = setInterval(() => {
            if (isModelPreloaded("/models/logo4.glb")) {
              setShouldShowThreeBackground(true);
              clearInterval(interval);
            }
          }, 50);

          const timeout = setTimeout(() => {
            setShouldShowThreeBackground(true);
            clearInterval(interval);
          }, 2000);

          return () => {
            clearInterval(interval);
            clearTimeout(timeout);
          };
        }
      };

      checkModel();
    } else {
      setShouldShowThreeBackground(false);
    }
  }, [currentBackground]);

  const renderBackground = () => {
    if (!currentBackground) {
      return null;
    }

    if (currentBackground.type === 'three' && shouldShowThreeBackground) {
      return (
        <ThreeBackgroundDisplay
          planeOpaque={currentBackground.options?.planeOpaque}
          bloomEnabled={currentBackground.options?.bloomEnabled}
        />
      );
    }

    if (currentBackground.type === 'image') {
      return <ImageBackgroundDisplay />;
    }

    return null;
  };


  return (
    <div className="relative min-h-screen">
      {renderBackground()}
      <div
        className={`min-h-screen flex flex-col ${className}`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        {pageConfig.showFooter && <Footer />}
      </div>
    </div>
  );
};
