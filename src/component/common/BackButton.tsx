import { cn } from "../../utils/cn";
import { useTransitionContext } from "../../hooks/useTransitionContext";

interface BackButtonProps {
  to?: string;
  className?: string;
}

export const BackButton = ({
  to = "/projects",
  className,
}: BackButtonProps) => {
  const { navigateWithTransition } = useTransitionContext();

  const handleClick = async () => {
    await navigateWithTransition(to);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative w-10 h-10 sm:w-14 sm:h-14 bg-transparent border-2 border-gray-500/60 hover:border-gray-400/80 rounded-full",
        "flex items-center justify-center",
        "transition-all duration-200 ease-out",
        "hover:scale-110 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
        "active:scale-95",
        className,
      )}
      aria-label="Go back"
    >
      <svg
        className="w-3 h-3 sm:w-4 sm:h-4 text-white transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

