import { VideoBackground } from "./VideoBackground";
import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
import { VideoProvider, useVideo } from "../../contexts/video";
import { Navbar } from "./Navbar";
import { FadeInContainer } from "../common/FadeInContainer";
import { usePageTracker } from "../../hooks/usePageTracker";
import { ROUTES } from "../../constants/routes";
import { cn } from "../../utils/cn";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  usePageTracker();
  const { shouldShowLayout, currentPage } = useVideo();

  const isHomePage = currentPage === ROUTES.HOME;

  return (
    <>
      <VideoBackground />
      <ImageBackgroundDisplay />
      <FadeInContainer isVisible={shouldShowLayout}>
        <div className={cn("min-h-screen grid grid-rows-[auto_1fr]")}>
          <Navbar />
          <main className={isHomePage ? "" : "overflow-auto"}>{children}</main>
        </div>
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
