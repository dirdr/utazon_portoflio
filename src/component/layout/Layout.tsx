import { VideoBackground } from "./VideoBackground";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { VideoProvider, useVideo } from "../../contexts/VideoContext";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FadeInContainer } from "../common/FadeInContainer";
import { usePageTracker } from "../../hooks/usePageTracker";
import { getPageConfig } from "../../config/pageConfig";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  usePageTracker();
  const { shouldShowLayout, currentPage } = useVideo();

  const pageConfig = getPageConfig(currentPage);
  const isHomePage = currentPage === "/";

  return (
    <>
      <VideoBackground />
      <ImageBackgroundDisplay />
      <FadeInContainer isVisible={shouldShowLayout}>
        {isHomePage ? (
          <div className="h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        ) : (
          <div className="min-h-screen">
            <Navbar />
            <main>{children}</main>
            {pageConfig.showFooter && <Footer />}
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
