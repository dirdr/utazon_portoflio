import { VideoBackground } from "./VideoBackground";
import { VideoProvider, useVideo } from "../common/VideoContext";
import { Navbar } from "./Navbar";
import { FadeInContainer } from "../common/FadeInContainer";
import { usePageTracker } from "../../hooks/usePageTracker";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  usePageTracker();
  const { shouldShowLayout } = useVideo();

  return (
    <>
      <VideoBackground />
      <FadeInContainer isVisible={shouldShowLayout}>
        <Navbar />
        <main>{children}</main>
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
