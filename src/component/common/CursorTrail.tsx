import { useEffect, useRef, useCallback, useMemo } from "react";
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
  maxPoints = 3000,
  fadeTime = 2500,
  rippleSize = 100,
  intensity = 0.5,
}: CursorTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(0);
  const pointsRef = useRef<TrailPoint[]>([]);
  const lastTrailPointRef = useRef({ x: 0, y: 0, timestamp: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });
  const lastCleanupRef = useRef(0);
  const canvasSizeRef = useRef({ width: 0, height: 0 });

  const addPoint = useCallback(
    (x: number, y: number, speed: number) => {
      const now = Date.now();
      const points = pointsRef.current;

      points.push({ x, y, timestamp: now, speed });

      if (points.length > maxPoints || points.length % 50 === 0) {
        const cutoff = now - fadeTime;
        let validStart = 0;

        while (
          validStart < points.length &&
          points[validStart].timestamp < cutoff
        ) {
          validStart++;
        }

        if (validStart > 0) {
          pointsRef.current = points.slice(validStart);
        }

        if (pointsRef.current.length > maxPoints) {
          pointsRef.current = pointsRef.current.slice(-maxPoints);
        }
      }
    },
    [maxPoints, fadeTime],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled) return;

      const { clientX, clientY } = e;
      const now = Date.now();

      currentMouseRef.current = { x: clientX, y: clientY };
      if (!animationRef.current) {
        const animate = () => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (!canvas || !ctx || !enabled) {
            animationRef.current = undefined;
            return;
          }

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

          if (currentTime - lastCleanupRef.current > 100) {
            const cutoff = currentTime - fadeTime;
            pointsRef.current = pointsRef.current.filter(
              (point) => point.timestamp >= cutoff,
            );
            lastCleanupRef.current = currentTime;
          }

          drawTrailPoints(ctx, currentTime);
          drawStaticGlow(ctx);

          if (enabled) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            animationRef.current = undefined;
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      }
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
    [enabled, addPoint, fadeTime],
  );

  const drawTrailPoints = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, now: number) => {
      const points = pointsRef.current;
      const len = points.length;

      for (let i = 0; i < len; i++) {
        const point = points[i];
        const age = now - point.timestamp;
        const ageRatio = age / fadeTime;

        if (ageRatio >= 1) continue;

        const trailFade = Math.pow(1 - ageRatio, 2);
        const currentOpacity = intensity * trailFade * 0.065;
        if (currentOpacity <= 0.002) continue;

        const baseSize = rippleSize * 0.4;

        const rippleProgress = ageRatio;
        const maxRippleSize = baseSize * 6;

        const drawExpandingRing = (ringDelay: number, ringOpacity: number) => {
          const ringProgress = Math.max(0, rippleProgress - ringDelay);
          if (ringProgress <= 0) return;

          const easedProgress = 1 - Math.pow(1 - ringProgress, 3);

          const ringFade = Math.pow(1 - ringProgress, 1.5);

          const waveOscillation = Math.sin(ringProgress * Math.PI * 4) * 0.1;
          const sizeMultiplier = 1 + waveOscillation * ringFade;

          const currentSize =
            (baseSize + (maxRippleSize - baseSize) * easedProgress) * sizeMultiplier;

          const finalOpacity = currentOpacity * ringOpacity * ringFade;

          if (finalOpacity <= 0.001) return;

          const ringThickness = baseSize * 0.5;
          const innerRadius = Math.max(0, currentSize - ringThickness);

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
            `rgba(255, 255, 255, ${finalOpacity * 0.15})`,
          );
          gradient.addColorStop(
            0.4,
            `rgba(255, 255, 255, ${finalOpacity * 0.2})`,
          );
          gradient.addColorStop(
            0.8,
            `rgba(255, 255, 255, ${finalOpacity * 0.1})`,
          );
          gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(point.x, point.y, currentSize, 0, Math.PI * 2);

          if (innerRadius > 0) {
            ctx.arc(point.x, point.y, innerRadius, 0, Math.PI * 2, true);
          }

          ctx.fill();
        };

        drawExpandingRing(0, 0.5);
        drawExpandingRing(0.15, 0.4);
        drawExpandingRing(0.3, 0.35);
        drawExpandingRing(0.45, 0.3);
        drawExpandingRing(0.6, 0.25);
        drawExpandingRing(0.75, 0.2);
      }
    };
  }, [fadeTime, intensity, rippleSize]);

  const drawStaticGlow = useMemo(() => {
    return (ctx: CanvasRenderingContext2D) => {
      const { x: currentX, y: currentY } = currentMouseRef.current;
      if (currentX <= 0 || currentY <= 0) return;

      const glowSize = rippleSize * 0.8;
      const gradient = ctx.createRadialGradient(
        currentX,
        currentY,
        0,
        currentX,
        currentY,
        glowSize,
      );

      gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.08})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${intensity * 0.04})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, glowSize, 0, Math.PI * 2);
      ctx.fill();
    };
  }, [rippleSize, intensity]);

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

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabled, handleMouseMove]);

  if (!enabled) return null;

  return (
    <OverlayManager>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none canvas-container"
        style={{
          zIndex: OVERLAY_Z_INDEX.CURSOR_TRAIL,
          mixBlendMode: "normal",
          willChange: "auto",
          contentVisibility: "auto",
        }}
      />
    </OverlayManager>
  );
};
