import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { ThreeBackgroundDisplay } from "./ThreeBackgroundDisplay";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useLocation } from "wouter";
import { getPageConfig } from "../../config/pageConfig";

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

  const renderBackground = () => {
    if (!currentBackground) {
      return null;
    }

    if (currentBackground.type === 'three') {
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
