import { useEffect, useState, useMemo } from "react";
import { LIGHT_CONFIG } from "../constants/threeConfig";
import { throttle } from "../utils/throttle";
import { mouseTracker } from "../utils/mouseTracker";

export const calculateLightingPositions = (
  clientX?: number,
  clientY?: number,
) => {
  const { x, y } =
    clientX !== undefined && clientY !== undefined
      ? { x: clientX, y: clientY }
      : mouseTracker.getPosition();

  const normalizedX = (x / window.innerWidth) * 2 - 1;
  const normalizedY = (y / window.innerHeight) * 2 - 1;

  const boundedX = Math.max(
    LIGHT_CONFIG.BOUNDS.X[0],
    Math.min(LIGHT_CONFIG.BOUNDS.X[1], normalizedX * LIGHT_CONFIG.SENSITIVITY),
  );
  const boundedY = Math.max(
    LIGHT_CONFIG.BOUNDS.Y[0],
    Math.min(LIGHT_CONFIG.BOUNDS.Y[1], -normalizedY * LIGHT_CONFIG.SENSITIVITY),
  );

  const distance = LIGHT_CONFIG.DISTANCE_FROM_CENTER;
  const baseOffsetX = 0.8;
  const baseOffsetY = -0.6;

  const fillLightPos: [number, number, number] = [
    baseOffsetX + boundedX * distance,
    baseOffsetY + boundedY * distance,
    LIGHT_CONFIG.BASE_Z,
  ];

  const keyLightPos: [number, number, number] = [
    -baseOffsetX + -boundedX * distance,
    -baseOffsetY + -boundedY * distance,
    LIGHT_CONFIG.BASE_Z,
  ];

  return { keyLightPos, fillLightPos };
};

export const useMouseBasedLighting = () => {
  const [keyLightPos, setKeyLightPos] = useState<[number, number, number]>([
    -0.8,
    0.6,
    LIGHT_CONFIG.BASE_Z,
  ]);
  const [fillLightPos, setFillLightPos] = useState<[number, number, number]>([
    0.8,
    -0.6,
    LIGHT_CONFIG.BASE_Z,
  ]);

  const throttledHandleMouseMove = useMemo(
    () =>
      throttle((event: MouseEvent) => {
        const { keyLightPos: newKeyPos, fillLightPos: newFillPos } =
          calculateLightingPositions(event.clientX, event.clientY);

        setKeyLightPos(newKeyPos);
        setFillLightPos(newFillPos);
      }, 16),
    [],
  );

  useEffect(() => {
    const initializeLighting = async () => {
      try {
        const currentPos = await mouseTracker.getCurrentPosition();

        const { keyLightPos: currentKeyPos, fillLightPos: currentFillPos } =
          calculateLightingPositions(currentPos.x, currentPos.y);

        setKeyLightPos(currentKeyPos);
        setFillLightPos(currentFillPos);
      } catch {
        const { keyLightPos: centerKeyPos, fillLightPos: centerFillPos } =
          calculateLightingPositions();
        setKeyLightPos(centerKeyPos);
        setFillLightPos(centerFillPos);
      }
    };

    initializeLighting();

    window.addEventListener("mousemove", throttledHandleMouseMove);

    return () =>
      window.removeEventListener("mousemove", throttledHandleMouseMove);
  }, [throttledHandleMouseMove]);

  return { keyLightPos, fillLightPos };
};

export const useDesktopLighting = () => {
  const mouseLighting = useMouseBasedLighting();

  return {
    keyLightPos: mouseLighting.keyLightPos,
    fillLightPos: mouseLighting.fillLightPos,
    rimLightPos: [0, 0, -8] as [number, number, number],
    keyIntensity: LIGHT_CONFIG.KEY_LIGHT.INTENSITY,
    fillIntensity: LIGHT_CONFIG.FILL_LIGHT.INTENSITY,
    rimIntensity: 0.8,
    ambientIntensity: LIGHT_CONFIG.AMBIENT.INTENSITY,
  };
};
