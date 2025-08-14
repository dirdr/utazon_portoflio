import { useEffect, useRef, useCallback } from 'react';
import { OverlayManager, OVERLAY_Z_INDEX } from './OverlayManager';

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
  maxPoints = 40,
  fadeTime = 500,
  rippleSize = 240,
  intensity = 0.5,
}: CursorTrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pointsRef = useRef<TrailPoint[]>([]);
  const lastMouseRef = useRef({ x: 0, y: 0, timestamp: 0 });
  const currentMouseRef = useRef({ x: 0, y: 0 });

  const addPoint = useCallback((x: number, y: number, speed: number) => {
    const now = Date.now();
    pointsRef.current.push({ x, y, timestamp: now, speed });
    
    if (pointsRef.current.length > maxPoints) {
      pointsRef.current = pointsRef.current.slice(-maxPoints);
    }
  }, [maxPoints]);

  const updateCanvasRef = useRef<() => void>();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    const { clientX, clientY } = e;
    const now = Date.now();
    
    // Always update current mouse position for the persistent spotlight
    currentMouseRef.current = { x: clientX, y: clientY };
    
    const deltaX = Math.abs(clientX - lastMouseRef.current.x);
    const deltaY = Math.abs(clientY - lastMouseRef.current.y);
    
    if (deltaX > 5 || deltaY > 5) {
      // Calculate speed based on distance and time
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const timeDiff = now - lastMouseRef.current.timestamp;
      const speed = timeDiff > 0 ? distance / timeDiff : 0;
      
      addPoint(clientX, clientY, speed);
      lastMouseRef.current = { x: clientX, y: clientY, timestamp: now };
    }
    
    // Always keep animation running for persistent spotlight
    if (!animationRef.current && updateCanvasRef.current) {
      animationRef.current = requestAnimationFrame(updateCanvasRef.current);
    }
  }, [enabled, addPoint]);

  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Only resize canvas when window size changes, not every frame
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const now = Date.now();
    pointsRef.current = pointsRef.current.filter(
      point => now - point.timestamp < fadeTime
    );

    // Draw discovery spotlight trail effect with speed-based sizing
    pointsRef.current.forEach((point) => {
      const age = now - point.timestamp;
      const ageRatio = age / fadeTime;
      
      // More aggressive fade for quicker trail disappearance
      const trailFade = Math.pow(1 - ageRatio, 2.2);
      const currentOpacity = intensity * trailFade * 0.6;
      
      // Speed-based size variation - faster movement = bigger ripples (slight variation)
      const speedFactor = Math.max(0.8, Math.min(1.3, 1 + point.speed * 0.15));
      const sizeWithSpeed = rippleSize * 0.9 * speedFactor; // Bigger trail size (90% of main)
      const currentSize = sizeWithSpeed * (1 - ageRatio * 0.3);
      
      if (currentOpacity > 0.01) {
        // Create natural speed-deformed trail ripples
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, currentSize
        );
        
        gradient.addColorStop(0, `rgba(120, 120, 120, ${currentOpacity * 0.8})`);
        gradient.addColorStop(0.3, `rgba(100, 100, 100, ${currentOpacity * 0.4})`);
        gradient.addColorStop(0.6, `rgba(80, 80, 80, ${currentOpacity * 0.2})`);
        gradient.addColorStop(1, `rgba(60, 60, 60, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, currentSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    
    // Draw large persistent discovery spotlight at current mouse position
    const currentX = currentMouseRef.current.x;
    const currentY = currentMouseRef.current.y;
    
    if (currentX > 0 && currentY > 0) {
      const mainSize = rippleSize * 1.2; // 20% bigger main spotlight
      
      const mainGradient = ctx.createRadialGradient(
        currentX, currentY, 0,
        currentX, currentY, mainSize
      );
      
      // Subtle dark gray persistent spotlight
      mainGradient.addColorStop(0, `rgba(140, 140, 140, ${intensity * 1.0})`);
      mainGradient.addColorStop(0.15, `rgba(120, 120, 120, ${intensity * 0.8})`);
      mainGradient.addColorStop(0.4, `rgba(100, 100, 100, ${intensity * 0.4})`);
      mainGradient.addColorStop(1, `rgba(80, 80, 80, 0)`);

      ctx.fillStyle = mainGradient;
      ctx.beginPath();
      ctx.arc(currentX, currentY, mainSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Larger outer glow for more dramatic effect
      const outerGlow = ctx.createRadialGradient(
        currentX, currentY, mainSize * 0.7,
        currentX, currentY, mainSize * 2.2
      );
      
      outerGlow.addColorStop(0, `rgba(100, 100, 100, 0)`);
      outerGlow.addColorStop(0.2, `rgba(90, 90, 90, ${intensity * 0.2})`);
      outerGlow.addColorStop(0.5, `rgba(80, 80, 80, ${intensity * 0.1})`);
      outerGlow.addColorStop(1, `rgba(70, 70, 70, 0)`);

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(currentX, currentY, mainSize * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Always keep animation running when enabled
    if (enabled) {
      animationRef.current = requestAnimationFrame(updateCanvas);
    } else {
      animationRef.current = undefined;
    }
  }, [enabled, fadeTime, rippleSize, intensity]);

  // Assign to ref so it can be called from handleMouseMove
  updateCanvasRef.current = updateCanvas;

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    if (!enabled) {
      pointsRef.current = [];
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
      return;
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    handleResize();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
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
          mixBlendMode: 'normal',
          willChange: 'auto',
        }}
      />
    </OverlayManager>
  );
};