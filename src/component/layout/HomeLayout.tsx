import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return <>{children}</>;
};

