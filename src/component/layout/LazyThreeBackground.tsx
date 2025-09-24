import React, { Suspense } from "react";

interface ThreeBackgroundDisplayProps {
  planeOpaque?: boolean;
  bloomEnabled?: boolean;
}

const ThreeBackgroundDisplay = React.lazy(() =>
  import('./ThreeBackgroundDisplay').then(module => ({
    default: module.ThreeBackgroundDisplay
  }))
);

const ThreeLoadingFallback: React.FC = () => (
  <div className="fixed inset-0" style={{ zIndex: -20 }}>
    <div className="w-full h-full bg-background opacity-50 flex items-center justify-center">
      <div className="text-muted text-sm">Loading 3D background...</div>
    </div>
  </div>
);

class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Three.js Background Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export const LazyThreeBackground: React.FC<ThreeBackgroundDisplayProps> = (props) => {
  return (
    <ThreeErrorBoundary>
      <Suspense fallback={<ThreeLoadingFallback />}>
        <ThreeBackgroundDisplay {...props} />
      </Suspense>
    </ThreeErrorBoundary>
  );
};