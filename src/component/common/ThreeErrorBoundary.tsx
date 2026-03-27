import React from "react";

interface ThreeErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ThreeErrorBoundaryState {
  hasError: boolean;
}

export class ThreeErrorBoundary extends React.Component<
  ThreeErrorBoundaryProps,
  ThreeErrorBoundaryState
> {
  constructor(props: ThreeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Three.js Background Error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ zIndex: -20 }}
        >
          <button
            onClick={this.handleRetry}
            className="text-muted text-sm px-4 py-2 border border-neutral-700 rounded-lg hover:border-neutral-500 transition-colors"
          >
            Retry loading 3D scene
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
