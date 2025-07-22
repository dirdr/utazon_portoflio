import { VideoBackground } from "./VideoBackground";
import { VideoProvider, useVideo } from "../../contexts/video";
import { Navbar } from "./Navbar";
import { FadeInContainer } from "../common/FadeInContainer";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
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
