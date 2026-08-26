import { useLocation } from "wouter";
import { HomeLayout } from "./HomeLayout";
import { StandardLayout } from "./StandardLayout";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [location] = useLocation();
  const isHomePage = location === "/";

  if (isHomePage) {
    return <HomeLayout>{children}</HomeLayout>;
  }

  return <StandardLayout>{children}</StandardLayout>;
};
