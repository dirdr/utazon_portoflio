// Global mouse position tracker for seamless lighting initialization
class MouseTracker {
  private static instance: MouseTracker;
  private lastX: number = window.innerWidth / 2;
  private lastY: number = window.innerHeight / 2;
  private initialized = false;
  private hasRealPosition = false;

  private constructor() {
    this.init();
  }

  static getInstance(): MouseTracker {
    if (!MouseTracker.instance) {
      MouseTracker.instance = new MouseTracker();
    }
    return MouseTracker.instance;
  }

  private init() {
    if (this.initialized) return;

    const trackMouse = (event: MouseEvent) => {
      this.lastX = event.clientX;
      this.lastY = event.clientY;
      this.hasRealPosition = true;
    };

    // Use passive listener for better performance
    window.addEventListener('mousemove', trackMouse, { passive: true });

    window.addEventListener('mouseenter', trackMouse, { passive: true });

    this.initialized = true;
  }

  getPosition(): { x: number; y: number } {
    return { x: this.lastX, y: this.lastY };
  }

  hasValidPosition(): boolean {
    return this.hasRealPosition;
  }

  // Get current position immediately using multiple detection methods
  getCurrentPosition(): Promise<{ x: number; y: number }> {
    return new Promise((resolve) => {
      if (this.hasRealPosition) {
        resolve({ x: this.lastX, y: this.lastY });
        return;
      }

      let resolved = false;
      const resolveOnce = (x: number, y: number) => {
        if (!resolved) {
          resolved = true;
          this.lastX = x;
          this.lastY = y;
          this.hasRealPosition = true;
          resolve({ x, y });
        }
      };

      const handleImmediate = (event: MouseEvent | PointerEvent) => {
        resolveOnce(event.clientX, event.clientY);
      };

      const createDetectionArea = () => {
        const detector = document.createElement('div');
        detector.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
        `;

        detector.addEventListener('mouseenter', handleImmediate, { passive: true, once: true });
        detector.addEventListener('mousemove', handleImmediate, { passive: true, once: true });

        document.body.appendChild(detector);

        setTimeout(() => {
          document.body.removeChild(detector);
        }, 500);

        setTimeout(() => {
          detector.style.pointerEvents = 'auto';
          setTimeout(() => {
            detector.style.pointerEvents = 'none';
          }, 50);
        }, 10);
      };

      window.addEventListener('mousemove', handleImmediate, { passive: true, once: true });
      window.addEventListener('pointermove', handleImmediate, { passive: true, once: true });
      window.addEventListener('mouseenter', handleImmediate, { passive: true, once: true });

      createDetectionArea();

      const tryRealEventCapture = () => {
        const captureHandler = (event: MouseEvent) => {
          if (event.isTrusted) { // Only respond to real mouse events
            resolveOnce(event.clientX, event.clientY);
          }
        };

        document.addEventListener('mousemove', captureHandler, { capture: true, once: true });
        setTimeout(() => {
          document.removeEventListener('mousemove', captureHandler, { capture: true });
        }, 150);
      };

      tryRealEventCapture();

      setTimeout(() => {
        if (!resolved) {
          resolveOnce(window.innerWidth / 2, window.innerHeight / 2);
        }
      }, 300);
    });
  }

  getNormalizedPosition(): { normalizedX: number; normalizedY: number } {
    const normalizedX = (this.lastX / window.innerWidth) * 2 - 1;
    const normalizedY = (this.lastY / window.innerHeight) * 2 - 1;
    return { normalizedX, normalizedY };
  }
}

export const mouseTracker = MouseTracker.getInstance();