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
    <Component
      className={cn(
        "w-full px-8 sm:px-10 lg:px-12 xl:px-24 2xl:px-24",
        className,
      )}
    >
      {children}
    </Component>
  );
};
