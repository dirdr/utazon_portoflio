import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title={title} />
      <main className="flex-1">{children}</main>
    </div>
  );
};
