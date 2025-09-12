import { cn } from "../../utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className={cn("w-full px-4 lg:px-12", className)}>{children}</div>
  );
};
