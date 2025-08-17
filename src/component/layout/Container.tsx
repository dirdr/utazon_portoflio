import { cn } from "../../utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Container = ({
  children,
  className,
  as: Component = "div",
}: ContainerProps) => {
  return (
    <Component className={cn("w-full px-4 lg:px-12", className)}>
      {children}
    </Component>
  );
};
