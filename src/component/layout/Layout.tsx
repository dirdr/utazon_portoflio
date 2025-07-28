import { VideoBackground } from "./VideoBackground";
import { RouteBackground } from "./RouteBackground";
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

  return (
    <div className="relative min-h-screen">
      <VideoBackground />
      <RouteBackground />
      {isHomePage ? (
        <FadeInContainer
          isVisible={shouldShowLayout}
          className="h-screen relative"
        >
          <Navbar />
          <main className="absolute inset-0 top-auto overflow-hidden">
            {children}
          </main>
        </FadeInContainer>
      ) : (
        <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
          <Navbar />
          <main>{children}</main>
          <div />
        </div>
      )}
    </div>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return <LayoutContent>{children}</LayoutContent>;
};
