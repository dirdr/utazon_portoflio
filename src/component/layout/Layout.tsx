import { ImageBackgroundDisplay } from "./ImageBackgroundDisplay";
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
      <ImageBackgroundDisplay />
      <main>{children}</main>
    </div>
  );
};

export const Layout = ({ children }: LayoutProps) => {
  return <LayoutContent>{children}</LayoutContent>;
};
