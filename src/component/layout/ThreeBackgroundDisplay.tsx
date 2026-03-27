import React, { Suspense, useEffect, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { isModelPreloaded } from "../../hooks/usePreloadAssets";
import { useCanvasComponent } from "../../hooks/useCanvasReadiness";
import { useDesktopLighting } from "../../hooks/useLightingSystem";
import {
  CameraController,
  useResponsiveCamera,
} from "../../hooks/useResponsiveCamera";
import { LIGHT_CONFIG, SHADOW_CONFIG } from "../../constants/threeConfig";
import { ThreeErrorBoundary } from "../common/ThreeErrorBoundary";
import { Model } from "./three/Model";

interface ThreeBackgroundDisplayProps {
  planeOpaque?: boolean;
  bloomEnabled?: boolean;
}

export const ThreeBackgroundDisplay: React.FC<ThreeBackgroundDisplayProps> = ({
  planeOpaque = false,
  bloomEnabled = true,
}) => {
  const {
    keyLightPos,
    fillLightPos,
    rimLightPos,
    keyIntensity,
    fillIntensity,
    rimIntensity,
    ambientIntensity,
  } = useDesktopLighting();
  const [isModelReady, setIsModelReady] = useState(false);
  const cameraConfig = useResponsiveCamera();

  const { setReady, setNotReady } = useCanvasComponent("three-background");
  const canvasReadinessReported = useRef(false);

  useEffect(() => {
    const checkModelReady = () => {
      if (isModelPreloaded("/models/logo4.glb")) {
        setIsModelReady(true);
      } else {
        const checkInterval = setInterval(() => {
          if (isModelPreloaded("/models/logo4.glb")) {
            setIsModelReady(true);
            clearInterval(checkInterval);
          }
        }, 100);

        const fallbackTimer = setTimeout(() => {
          setIsModelReady(true);
          clearInterval(checkInterval);
        }, 3000);
        return () => {
          clearInterval(checkInterval);
          clearTimeout(fallbackTimer);
        };
      }
    };

    checkModelReady();
  }, []);

  useEffect(() => {
    if (isModelReady && !canvasReadinessReported.current) {
      const timer = setTimeout(() => {
        setReady();
        canvasReadinessReported.current = true;
      }, 100);

      return () => clearTimeout(timer);
    } else if (!isModelReady && canvasReadinessReported.current) {
      setNotReady();
      canvasReadinessReported.current = false;
    }
  }, [isModelReady, setReady, setNotReady]);

  if (!isModelReady) {
    return null;
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      <div className="w-full h-full">
        <Canvas
          shadows
          camera={{
            position: cameraConfig.position,
            fov: cameraConfig.fov,
          }}
          gl={{
            antialias: window.devicePixelRatio <= 1,
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
          }}
        >
          <CameraController config={cameraConfig} />
          <OrbitControls
            target={cameraConfig.target}
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />

          <ambientLight intensity={ambientIntensity} />

          <directionalLight
            position={keyLightPos}
            intensity={keyIntensity}
            castShadow
            shadow-mapSize-width={SHADOW_CONFIG.MAP_SIZE}
            shadow-mapSize-height={SHADOW_CONFIG.MAP_SIZE}
            shadow-camera-left={SHADOW_CONFIG.CAMERA_BOUNDS.LEFT}
            shadow-camera-right={SHADOW_CONFIG.CAMERA_BOUNDS.RIGHT}
            shadow-camera-top={SHADOW_CONFIG.CAMERA_BOUNDS.TOP}
            shadow-camera-bottom={SHADOW_CONFIG.CAMERA_BOUNDS.BOTTOM}
            shadow-camera-near={SHADOW_CONFIG.CAMERA_BOUNDS.NEAR}
            shadow-camera-far={SHADOW_CONFIG.CAMERA_BOUNDS.FAR}
            shadow-bias={SHADOW_CONFIG.BIAS}
            shadow-radius={SHADOW_CONFIG.RADIUS}
          />

          <directionalLight position={fillLightPos} intensity={fillIntensity} />

          <directionalLight
            position={rimLightPos}
            intensity={rimIntensity}
            color="#ffffff"
          />

          <pointLight
            position={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_1.POSITION}
            intensity={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_1.INTENSITY}
            color={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_1.COLOR}
          />

          <pointLight
            position={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_2.POSITION}
            intensity={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_2.INTENSITY}
            color={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_2.COLOR}
          />

          <Suspense fallback={null}>
            <ThreeErrorBoundary>
              <Model url="/models/logo4.glb" planeOpaque={planeOpaque} />
            </ThreeErrorBoundary>
          </Suspense>

          {bloomEnabled && (
            <EffectComposer>
              <Bloom
                intensity={LIGHT_CONFIG.BLOOM.INTENSITY}
                luminanceThreshold={LIGHT_CONFIG.BLOOM.LUMINANCE_THRESHOLD}
                luminanceSmoothing={LIGHT_CONFIG.BLOOM.LUMINANCE_SMOOTHING}
              />
              <Noise opacity={LIGHT_CONFIG.NOISE.OPACITY} />
            </EffectComposer>
          )}
        </Canvas>
      </div>
    </div>
  );
};
