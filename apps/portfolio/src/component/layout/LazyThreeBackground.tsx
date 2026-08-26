import React, { Suspense, memo } from "react";
import { ThreeErrorBoundary } from "../common/ThreeErrorBoundary";

interface ThreeBackgroundDisplayProps {
  planeOpaque?: boolean;
  bloomEnabled?: boolean;
}

const ThreeBackgroundDisplay = React.lazy(() =>
  import("./ThreeBackgroundDisplay").then((module) => ({
    default: module.ThreeBackgroundDisplay,
  })),
);

const ThreeLoadingFallback = memo(() => (
  <div className="fixed inset-0 z-0">
    <div className="w-full h-full bg-background opacity-50 flex items-center justify-center">
      <div className="text-muted text-sm">Loading 3D background...</div>
    </div>
  </div>
));

export const LazyThreeBackground: React.FC<ThreeBackgroundDisplayProps> = (
  props,
) => {
  return (
    <ThreeErrorBoundary>
      <Suspense fallback={<ThreeLoadingFallback />}>
        <ThreeBackgroundDisplay {...props} />
      </Suspense>
    </ThreeErrorBoundary>
  );
};
