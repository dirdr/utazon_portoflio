import { RouteBackground } from "./RouteBackground";
import { Navbar } from "./Navbar";
import { useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  const isHomePage = location === "/";

  // For home page, let HomeContainer handle everything (video, navbar, content)
  if (isHomePage) {
    return <>{children}</>;
  }

  // For non-home pages, show normal layout
  return (
    <div className="relative min-h-screen">
      <RouteBackground />
      <div className="min-h-screen">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return <LayoutContent>{children}</LayoutContent>;
};
