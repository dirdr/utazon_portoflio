import { cn } from "../../utils/cn";

export interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader = ({ size = 256, className }: LoaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
      role="status"
      aria-label={"Loading"}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full border-4 border-gray-800/30" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"
          style={{ animationDuration: "1.5s" }}
        />
      </div>
      <span className="text-lg text-white font-nord font-light italic">
        Loading
      </span>
    </div>
  );
};
