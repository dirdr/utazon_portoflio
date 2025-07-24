import { VideoBackground } from "./VideoBackground";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { VideoProvider } from "../../contexts/VideoContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FadeInContainer } from "../common/FadeInContainer";
import { getPageConfig } from "../../config/pageConfig";
import { useVideo } from "../../hooks/useVideo";
import { useRouteBasedVideo } from "../../hooks/useRouteBasedVideo";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const { shouldShowLayout: videoLayoutReady } = useVideo();
  const { currentPath, shouldShowLayout } = useRouteBasedVideo();

  const pageConfig = getPageConfig(currentPath);
  const isHomePage = currentPath === "/";

  return (
    <>
      <VideoBackground />
      <ImageBackgroundDisplay />
      <FadeInContainer
        isVisible={isHomePage ? videoLayoutReady : shouldShowLayout}
      >
        {isHomePage ? (
          <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        ) : (
          <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            {pageConfig.showFooter ? (
              <Footer />
            ) : (
              <div className="py-4 md:py-8" />
            )}
          </div>
        )}
      </FadeInContainer>
    </>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <VideoProvider>
      <LayoutContent>{children}</LayoutContent>
    </VideoProvider>
  );
};
