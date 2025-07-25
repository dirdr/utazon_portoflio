import { VideoBackground } from "./VideoBackground";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { Navbar } from "./Navbar";
import { useRouteBasedVideo } from "../../hooks/useRouteBasedVideo";
import { FadeInContainer } from "../common/FadeInContainer";
import { useVideo } from "../../hooks/useVideo";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const { currentPath } = useRouteBasedVideo();
  const { shouldShowLayout } = useVideo();
  const isHomePage = currentPath === "/";
  
  console.log('🏠 Layout.tsx Render:', { 
    currentPath, 
    isHomePage, 
    shouldShowLayout,
    renderingHomeBranch: isHomePage
  });

  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      <ImageBackgroundDisplay />
      {isHomePage ? (
        // Home page: simple fade transition for navbar and content together
        <FadeInContainer isVisible={shouldShowLayout} className="h-screen relative">
          <Navbar />
          <main className="absolute inset-0 top-auto overflow-hidden">{children}</main>
        </FadeInContainer>
      ) : (
        // Other pages: stable grid layout prevents navbar shifting
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
          <Navbar />
          <main>{children}</main>
          <div /> {/* Footer placeholder - prevents layout shift */}
        </div>
      )}
    </div>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return <LayoutContent>{children}</LayoutContent>;
};
