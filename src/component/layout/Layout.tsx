import VideoBackground from "./VideoBackground";
import { VideoProvider } from "../common/VideoContext";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <VideoProvider>
      <VideoBackground />
      <Navbar />
      <main>{children}</main>
    </VideoProvider>
  );
};
