import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { OverlayManager } from "./OverlayManager";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
  speed: number;
}

interface CursorTrailProps {
  enabled: boolean;
  maxPoints?: number;
  fadeTime?: number;
  rippleSize?: number;
  intensity?: number;
}

export const CursorTrail = ({
  enabled = false,
  maxPoints = 300,
  fadeTime = 2500,
  rippleSize = 150,
  intensity = 0.5,
}: CursorTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pointsRef = useRef<TrailPoint[]>([]);
  const lastTrailPointRef = useRef({ x: 0, y: 0, timestamp: 0 });
  // Separate refs for immediate cursor position vs trail points
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const lastCleanupRef = useRef(0);
  const canvasSizeRef = useRef({ width: 0, height: 0 });
  const [responsiveScale, setResponsiveScale] = useState(1);

  // Memoize scale calculation to prevent unnecessary recalculations
  const updateResponsiveScale = useCallback(() => {
    const baseWidth = 1920;
    const currentWidth = window.innerWidth;
    const scale = Math.min(Math.max(currentWidth / baseWidth, 0.6), 1.2);
    setResponsiveScale(scale);
  }, []);

  // Optimized point addition with batch cleanup
  const addPoint = useCallback(
    (x: number, y: number, speed: number) => {
      const now = Date.now();
      const points = pointsRef.current;

      points.push({ x, y, timestamp: now, speed });

      // Batch cleanup every 50 points or when max is exceeded
      if (points.length > maxPoints || points.length % 50 === 0) {
        const cutoff = now - fadeTime;
        let validStart = 0;

        // Find first valid point
        while (
          validStart < points.length &&
          points[validStart].timestamp < cutoff
        ) {
          validStart++;
        }

        if (validStart > 0) {
          pointsRef.current = points.slice(validStart);
        }

        // Trim to max points if still over limit
        if (pointsRef.current.length > maxPoints) {
          pointsRef.current = pointsRef.current.slice(-maxPoints);
        }
      }
    },
    [maxPoints, fadeTime],
  );

  // Immediate mouse position update - no throttling for static glow
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;

      const { clientX, clientY } = e;
      const now = Date.now();

      // Always update current position immediately for static glow
      currentMouseRef.current = { x: clientX, y: clientY };

      // Start animation loop if not running
      if (!animationRef.current) {
        const animate = () => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (!canvas || !ctx || !enabled) {
            animationRef.current = undefined;
            return;
          }

          // Check for canvas resize less frequently
          const needsResize =
            canvas.width !== window.innerWidth ||
            canvas.height !== window.innerHeight;

          if (needsResize) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvasSizeRef.current = {
              width: canvas.width,
              height: canvas.height,
            };
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const currentTime = Date.now();

          // Clean up old points less frequently
          if (currentTime - lastCleanupRef.current > 100) {
            const cutoff = currentTime - fadeTime;
            pointsRef.current = pointsRef.current.filter(
              (point) => point.timestamp >= cutoff,
            );
            lastCleanupRef.current = currentTime;
          }

          // Draw trail points
          drawTrailPoints(ctx, currentTime);

          // Draw static glow with current mouse position
          drawStaticGlow(ctx);

          if (enabled) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            animationRef.current = undefined;
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      }

      // Add trail points with reduced threshold for smoother trails
      const deltaX = Math.abs(clientX - lastTrailPointRef.current.x);
      const deltaY = Math.abs(clientY - lastTrailPointRef.current.y);

      if (deltaX > 2 || deltaY > 2) {
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const timeDiff = now - lastTrailPointRef.current.timestamp;
        const speed = timeDiff > 0 ? distance / timeDiff : 0;

        addPoint(clientX, clientY, speed);
        lastTrailPointRef.current = { x: clientX, y: clientY, timestamp: now };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, addPoint, fadeTime],
  );

  // Memoize drawing functions to prevent recreation
  const drawTrailPoints = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, now: number) => {
      const points = pointsRef.current;
      const len = points.length;

      for (let i = 0; i < len; i++) {
        const point = points[i];
        const age = now - point.timestamp;
        const ageRatio = age / fadeTime;

        if (ageRatio >= 1) continue; // Skip expired points

        const trailFade = Math.pow(1 - ageRatio, 2);
        const currentOpacity = intensity * trailFade * 0.065;
        if (currentOpacity <= 0.002) continue;

        const baseSize = rippleSize * 0.4 * responsiveScale;

        // Expanding ripple effect: each ring grows outward over time
        const rippleProgress = ageRatio; // 0 to 1 as point ages
        const maxRippleSize = baseSize * 4; // Maximum expansion size

        // Create expanding ripple rings that grow outward over time
        const drawExpandingRing = (ringDelay: number, ringOpacity: number) => {
          // Each ring starts expanding after a delay
          const ringProgress = Math.max(0, rippleProgress - ringDelay);
          if (ringProgress <= 0) return;

          // Ring expands from baseSize to maxRippleSize
          const currentSize =
            baseSize + (maxRippleSize - baseSize) * ringProgress;

          // Ring fades as it expands
          const ringFade = Math.pow(1 - ringProgress, 1.5);
          const finalOpacity = currentOpacity * ringOpacity * ringFade;

          if (finalOpacity <= 0.001) return;

          // Create expanding wave ring effect - thick ring that's filled
          const ringThickness = baseSize * 0.5; // Thicker rings
          const innerRadius = Math.max(0, currentSize - ringThickness);

          // First draw the filled ring
          const gradient = ctx.createRadialGradient(
            point.x,
            point.y,
            innerRadius,
            point.x,
            point.y,
            currentSize,
          );

          gradient.addColorStop(
            0,
            `rgba(255, 255, 255, ${finalOpacity * 0.3})`,
          );
          gradient.addColorStop(
            0.3,
            `rgba(255, 255, 255, ${finalOpacity * 0.4})`,
          );
          gradient.addColorStop(
            0.7,
            `rgba(255, 255, 255, ${finalOpacity * 0.25})`,
          );
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, currentSize, 0, Math.PI * 2);

          // Create inner hole for ring effect (if inner radius > 0)
          if (innerRadius > 0) {
            ctx.arc(point.x, point.y, innerRadius, 0, Math.PI * 2, true);
          }

          ctx.fill();
        };

        // Draw multiple expanding rings with staggered timing
        drawExpandingRing(0, 0.7); // First ring starts immediately
        drawExpandingRing(0.2, 0.5); // Second ring starts at 20% progress
        drawExpandingRing(0.4, 0.35); // Third ring starts at 40% progress
      }
    };
  }, [fadeTime, intensity, rippleSize, responsiveScale]);

  // Memoize static glow drawing function
  const drawStaticGlow = useMemo(() => {
    return (ctx: CanvasRenderingContext2D) => {
      const { x: currentX, y: currentY } = currentMouseRef.current;
      if (currentX <= 0 || currentY <= 0) return;

      const mainSize = rippleSize * 1.2 * responsiveScale;

      // Inner glow
      const innerSize = mainSize * 0.08;
      const innerGradient = ctx.createRadialGradient(
        currentX,
        currentY,
        0,
        currentX,
        currentY,
        innerSize * 3,
      );

      innerGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.15})`);
      innerGradient.addColorStop(
        0.3,
        `rgba(255, 255, 255, ${intensity * 0.08})`,
      );
      innerGradient.addColorStop(
        0.7,
        `rgba(255, 255, 255, ${intensity * 0.02})`,
      );
      innerGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.fillStyle = innerGradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, innerSize * 3, 0, Math.PI * 2);
      ctx.fill();

      // Main glow
      const mainGradient = ctx.createRadialGradient(
        currentX,
        currentY,
        mainSize * 0.3,
        currentX,
        currentY,
        mainSize,
      );

      mainGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.06})`);
      mainGradient.addColorStop(
        0.4,
        `rgba(255, 255, 255, ${intensity * 0.03})`,
      );
      mainGradient.addColorStop(
        0.8,
        `rgba(255, 255, 255, ${intensity * 0.01})`,
      );
      mainGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.fillStyle = mainGradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, mainSize, 0, Math.PI * 2);
      ctx.fill();

      // Outer glow
      const outerSize = mainSize * 1.8;
      const outerGlow = ctx.createRadialGradient(
        currentX,
        currentY,
        mainSize * 0.6,
        currentX,
        currentY,
        outerSize,
      );

      outerGlow.addColorStop(0, `rgba(255, 255, 255, 0)`);
      outerGlow.addColorStop(0.2, `rgba(255, 255, 255, ${intensity * 0.01})`);
      outerGlow.addColorStop(0.7, `rgba(255, 255, 255, ${intensity * 0.005})`);
      outerGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(currentX, currentY, outerSize, 0, Math.PI * 2);
      ctx.fill();
    };
  }, [rippleSize, responsiveScale, intensity]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateResponsiveScale();
  }, [updateResponsiveScale]);

  useEffect(() => {
    if (!enabled) {
      pointsRef.current = [];
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    handleResize();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, handleMouseMove, handleResize]);

  if (!enabled) return null;

  return (
    <OverlayManager>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: OVERLAY_Z_INDEX.CURSOR_TRAIL,
          mixBlendMode: "normal",
          willChange: "auto",
        }}
      />
    </OverlayManager>
  );
};
