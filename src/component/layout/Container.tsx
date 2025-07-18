import { cn } from "../../utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const Container = ({ 
  children, 
  className, 
  as: Component = "div" 
}: ContainerProps) => {
  return (
    <Component
      className={cn(
        "w-full px-[5%] sm:px-[8%] lg:px-[8%] xl:px-[8%] 2xl:px-[10%]",
        className
      )}
    >
      {children}
    </Component>
  );
};