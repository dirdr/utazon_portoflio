import { cn } from "../../utils/cn";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fluid' | 'constrained';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  as?: 'div' | 'main' | 'section' | 'article' | 'header' | 'footer';
}

const MAX_WIDTH_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
} as const;

export const Container = ({
  children,
  className,
  variant = 'constrained',
  maxWidth,
  as = 'div'
}: ContainerProps) => {
  const baseClasses = "w-full px-4 lg:px-12";

  const variantClasses = variant === 'constrained' && maxWidth
    ? `${MAX_WIDTH_CLASSES[maxWidth]} mx-auto`
    : '';

  const Tag = as;

  return (
    <Tag className={cn(baseClasses, variantClasses, className)}>
      {children}
    </Tag>
  );
};
