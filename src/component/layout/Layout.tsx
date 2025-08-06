import { RouteBackground } from "./RouteBackground";
import { Navbar } from "./Navbar";
import { useLocation } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

const LayoutContent = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  const isHomePage = location === "/";

  if (isHomePage) {
    return <>{children}</>;
  }

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
