import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackgroundPortal } from "./BackgroundPortal";
import { useLocation } from "wouter";
import { getPageConfig } from "../../config/pageConfig";

interface StandardLayoutProps {
  children: ReactNode;
  className?: string;
}

export const StandardLayout = ({
  children,
  className = "",
}: StandardLayoutProps) => {
  const [location] = useLocation();
  const pageConfig = getPageConfig(location);

  return (
    <div className="relative min-h-screen">
      <BackgroundPortal />
      <div className={`relative z-10 min-h-screen flex flex-col ${className}`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        {pageConfig.showFooter && <Footer />}
      </div>
    </div>
  );
};
