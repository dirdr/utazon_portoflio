import { useEffect, useState, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  CAMERA_CONFIG,
  BREAKPOINT_THRESHOLDS,
  type CameraConfig,
} from "../constants/threeConfig";

export interface CameraControllerProps {
  config: CameraConfig;
}

export function CameraController({ config }: CameraControllerProps) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (camera) {
      camera.position.set(...config.position);

      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = config.fov;
        camera.updateProjectionMatrix();
      }
    }
    if (controls && "target" in controls && "update" in controls) {
      const orbitControls = controls as {
        target: THREE.Vector3;
        update: () => void;
      };
      orbitControls.target.set(...config.target);
      orbitControls.update();
    }
  }, [camera, controls, config]);

  return null;
}

const getCurrentBreakpoint = (width: number) => {
  if (width >= BREAKPOINT_THRESHOLDS.XXL) return "XXL";
  return "XL";
};

const getCameraConfigForBreakpoint = (
  breakpoint: keyof typeof CAMERA_CONFIG.BREAKPOINTS,
) => {
  return CAMERA_CONFIG.BREAKPOINTS[breakpoint];
};

const useResponsiveCameraBase = () => {
  const [cameraConfig, setCameraConfig] = useState(() => {
    const breakpoint = getCurrentBreakpoint(window.innerWidth);
    return getCameraConfigForBreakpoint(breakpoint);
  });

  useEffect(() => {
    const updateCameraConfig = () => {
      const breakpoint = getCurrentBreakpoint(window.innerWidth);
      const newConfig = getCameraConfigForBreakpoint(breakpoint);
      setCameraConfig(newConfig);
    };

    updateCameraConfig();
    window.addEventListener("resize", updateCameraConfig);
    return () => window.removeEventListener("resize", updateCameraConfig);
  }, []);

  return cameraConfig;
};

export const useResponsiveCamera = (): CameraConfig => {
  const baseCameraConfig = useResponsiveCameraBase();

  return useMemo(() => {
    return {
      position: baseCameraConfig.POSITION,
      target: baseCameraConfig.TARGET,
      fov: baseCameraConfig.FOV,
    };
  }, [baseCameraConfig]);
};
