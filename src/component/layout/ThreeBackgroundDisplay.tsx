import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import {
  getPreloadedModel,
  isModelPreloaded,
} from "../../hooks/usePreloadAssets";
import { LenisContext } from "../../contexts/LenisContext";
import { useCanvasComponent } from "../../hooks/useCanvasReadiness";

// TypeScript interfaces for camera configuration
interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

interface CameraControllerProps {
  config: CameraConfig;
}

// Modular camera controller component
function CameraController({ config }: CameraControllerProps) {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (camera) {
      // Update camera position
      camera.position.set(...config.position);

      // Update FOV for perspective cameras
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = config.fov;
        camera.updateProjectionMatrix();
      }
    }

    // Update OrbitControls target if available
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

const LIGHT_CONFIG = {
  BOUNDS: {
    X: [-1.5, 1.5] as const,
    Y: [-1.5, 1.5] as const,
  },
  SENSITIVITY: 1.2,
  DISTANCE_FROM_CENTER: 1.0,
  BASE_Z: -6,
  KEY_LIGHT: {
    INTENSITY: 1.5,
  },
  FILL_LIGHT: {
    INTENSITY: 0.3,
  },
  POINT_LIGHTS: {
    LIGHT_1: {
      POSITION: [3, -1.2, -6] as [number, number, number],
      INTENSITY: 5,
      COLOR: 0xffffff,
    },
    LIGHT_2: {
      POSITION: [-3, 0.5, -6] as [number, number, number],
      INTENSITY: 5,
      COLOR: 0xffffff,
    },
  },
  INTENSITY: 0.1,
  AMBIENT: {
    INTENSITY: 0.1,
  },
  BLOOM: {
    INTENSITY: 2,
    LUMINANCE_THRESHOLD: 0.1,
    LUMINANCE_SMOOTHING: 0.9,
  },
  NOISE: {
    OPACITY: 0.008,
  },
} as const;

const CAMERA_CONFIG = {
  BREAKPOINTS: {
    DEFAULT: {
      POSITION: [0, -1.6, -2] as [number, number, number],
      FOV: 75,
      TARGET: [0, -1.6, -7.4] as [number, number, number],
    },
    // sm: 640px+
    SM: {
      POSITION: [0, -1.6, -2] as [number, number, number],
      FOV: 70,
      TARGET: [0, -1.6, -7.4] as [number, number, number],
    },
    // md: 768px+
    MD: {
      POSITION: [0, -1.6, -2] as [number, number, number],
      FOV: 67,
      TARGET: [0, -1.6, -7.4] as [number, number, number],
    },
    // lg: 1024px+
    LG: {
      POSITION: [0, -2, -2] as [number, number, number],
      FOV: 62,
      TARGET: [0, -1.6, -7.4] as [number, number, number],
    },
    // xl: 1280px+
    XL: {
      POSITION: [0, 0, -4] as [number, number, number],
      FOV: 60,
      TARGET: [0, 0, -7.4] as [number, number, number],
    },
    // 2xl: 1536px+
    XXL: {
      POSITION: [0, 0.2, -4.5] as [number, number, number],
      FOV: 55,
      TARGET: [0, 0.1, -7.4] as [number, number, number],
    },
  },
} as const;

const BREAKPOINT_THRESHOLDS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

const SHADOW_CONFIG = {
  MAP_SIZE: 512,
  CAMERA_BOUNDS: {
    LEFT: -2,
    RIGHT: 2,
    TOP: 2,
    BOTTOM: -2,
    NEAR: 0.1,
    FAR: 15,
  },
  BIAS: -0.0008,
  RADIUS: 2,
} as const;

const throttle = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number,
) => {
  let timeoutId: number | null = null;
  let lastExecTime = 0;

  return (...args: T) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func(...args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime),
      ) as unknown as number;
    }
  };
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    return;
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

type ModelProps = {
  url: string;
  planeOpaque?: boolean;
};

function Model({ url, planeOpaque = false }: ModelProps) {
  const gltfFromHook = useGLTF(url);
  const preloadedGltf = getPreloadedModel(url);
  const gltf = (preloadedGltf || gltfFromHook) as GLTF;
  const logoRef = useRef<THREE.Object3D>(null);
  const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material>>(
    new Map(),
  );
  const originalPositionsRef = useRef<Map<THREE.Object3D, THREE.Vector3>>(
    new Map(),
  );
  const meshCacheRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const scrollY = useScrollOffset();

  const logoYOffset = useMemo(() => {
    const isMobileDevice = window.innerWidth < BREAKPOINT_THRESHOLDS.XL;

    if (isMobileDevice) {
      return 0;
    } else {
      const scrollDivisor = 5;
      const maxOffset = 4.5;
      const scrollFactor = scrollY / (window.innerHeight * scrollDivisor);
      return Math.min(scrollFactor * maxOffset, maxOffset);
    }
  }, [scrollY]);
  useEffect(() => {
    if (gltf.scene) {
      const logoMesh = gltf.scene.getObjectByName("LOGO");
      const planeMesh = gltf.scene.getObjectByName("PLANE");

      if (planeMesh && !meshCacheRef.current.has("PLANE")) {
        meshCacheRef.current.set("PLANE", planeMesh as THREE.Mesh);
        planeMesh.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            if (!originalMaterialsRef.current.has(child)) {
              originalMaterialsRef.current.set(child, child.material);
            }
          }
        });
      }

      if (logoMesh && !meshCacheRef.current.has("LOGO")) {
        meshCacheRef.current.set("LOGO", logoMesh as THREE.Mesh);
        if (!originalPositionsRef.current.has(logoMesh)) {
          originalPositionsRef.current.set(logoMesh, logoMesh.position.clone());
        }

        logoMesh.traverse((child: THREE.Object3D) => {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;

            if (child.material && "roughness" in child.material) {
              const material = child.material as THREE.MeshStandardMaterial;
              material.roughness = 0.7;
              material.metalness = 0.1;
              material.envMapIntensity = 0.3;
            }
          }
        });

        if (logoRef.current) {
          logoRef.current.position.copy(logoMesh.position);
        }
      }

      if (planeMesh && !originalPositionsRef.current.has(planeMesh)) {
        originalPositionsRef.current.set(planeMesh, planeMesh.position.clone());
      }
    }
  }, [gltf]);

  useEffect(() => {
    // No need to skip position updates - both mobile and desktop can have movement

    const logoMesh = meshCacheRef.current.get("LOGO");
    const planeMesh = meshCacheRef.current.get("PLANE");

    if (logoMesh) {
      const originalPos = originalPositionsRef.current.get(logoMesh);
      if (originalPos) {
        logoMesh.position.y = originalPos.y + logoYOffset;
      }
    }
    if (planeMesh) {
      const originalPos = originalPositionsRef.current.get(planeMesh);
      if (originalPos) {
        planeMesh.position.y = originalPos.y + logoYOffset;
      }
    }
  }, [logoYOffset]);

  const opaqueMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: false,
      }),
    [],
  );

  useEffect(() => {
    const planeMesh = meshCacheRef.current.get("PLANE");
    if (planeMesh) {
      planeMesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (planeOpaque) {
            child.material = opaqueMaterial;
            child.receiveShadow = false;
            child.castShadow = false;
          } else {
            const originalMaterial = originalMaterialsRef.current.get(child);
            if (originalMaterial) {
              child.material = originalMaterial;
              child.receiveShadow = true;
              child.castShadow = true;
            }
          }
        }
      });
    }
  }, [planeOpaque, opaqueMaterial]);

  return (
    <>
      <primitive object={gltf.scene} scale={1.6} />
      <object3D ref={logoRef} position={[0, 0, 0]} />
    </>
  );
}

const useMouseBasedLighting = () => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledHandleMouseMove = useCallback(
    throttle((event: MouseEvent) => {
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;

      const boundedX = Math.max(
        LIGHT_CONFIG.BOUNDS.X[0],
        Math.min(
          LIGHT_CONFIG.BOUNDS.X[1],
          normalizedX * LIGHT_CONFIG.SENSITIVITY,
        ),
      );
      const boundedY = Math.max(
        LIGHT_CONFIG.BOUNDS.Y[0],
        Math.min(
          LIGHT_CONFIG.BOUNDS.Y[1],
          -normalizedY * LIGHT_CONFIG.SENSITIVITY,
        ),
      );

      const distance = LIGHT_CONFIG.DISTANCE_FROM_CENTER;

      // Base offset to position lights at bottom-right when mouse is centered
      const baseOffsetX = 0.8; // Offset to the right
      const baseOffsetY = -0.6; // Offset downward

      setFillLightPos([
        baseOffsetX + boundedX * distance,
        baseOffsetY + boundedY * distance,
        LIGHT_CONFIG.BASE_Z,
      ]);

      setKeyLightPos([
        -baseOffsetX + -boundedX * distance,
        -baseOffsetY + -boundedY * distance,
        LIGHT_CONFIG.BASE_Z,
      ]);
    }, 16), // ~60fps
    [setFillLightPos, setKeyLightPos],
  );

  useEffect(() => {
    window.addEventListener("mousemove", throttledHandleMouseMove);
    return () =>
      window.removeEventListener("mousemove", throttledHandleMouseMove);
  }, [throttledHandleMouseMove]);

  return { keyLightPos, fillLightPos };
};

// const useScrollBasedLighting = (scrollY: number) => {
//   const [keyLightPos, setKeyLightPos] = useState<[number, number, number]>([
//     -0.8,
//     0.6,
//     LIGHT_CONFIG.BASE_Z,
//   ]);
//   const [fillLightPos, setFillLightPos] = useState<[number, number, number]>([
//     0.8,
//     -0.6,
//     LIGHT_CONFIG.BASE_Z,
//   ]);

//   useEffect(() => {
//     const baseOffsetX = 0.8;
//     const baseOffsetY = -0.6;

//     const circleRadius = 1.0; // Radius of the circular motion
//     const rotationSpeed = 3; // Number of full rotations per viewport height

//     const scrollAngle =
//       (scrollY / window.innerHeight) * Math.PI * 2 * rotationSpeed;

//     const keyLightAngle = scrollAngle;
//     const fillLightAngle = scrollAngle + Math.PI; // Opposite side of circle

//     const keyLightX = baseOffsetX + Math.cos(keyLightAngle) * circleRadius;
//     const keyLightY = baseOffsetY + Math.sin(keyLightAngle) * circleRadius;

//     const fillLightX = baseOffsetX + Math.cos(fillLightAngle) * circleRadius;
//     const fillLightY = baseOffsetY + Math.sin(fillLightAngle) * circleRadius;

//     const boundedKeyX = Math.max(
//       LIGHT_CONFIG.BOUNDS.X[0],
//       Math.min(LIGHT_CONFIG.BOUNDS.X[1], keyLightX),
//     );
//     const boundedKeyY = Math.max(
//       LIGHT_CONFIG.BOUNDS.Y[0],
//       Math.min(LIGHT_CONFIG.BOUNDS.Y[1], keyLightY),
//     );

//     const boundedFillX = Math.max(
//       LIGHT_CONFIG.BOUNDS.X[0],
//       Math.min(LIGHT_CONFIG.BOUNDS.X[1], fillLightX),
//     );
//     const boundedFillY = Math.max(
//       LIGHT_CONFIG.BOUNDS.Y[0],
//       Math.min(LIGHT_CONFIG.BOUNDS.Y[1], fillLightY),
//     );

//     setKeyLightPos([boundedKeyX, boundedKeyY, LIGHT_CONFIG.BASE_Z]);
//     setFillLightPos([boundedFillX, boundedFillY, LIGHT_CONFIG.BASE_Z]);
//   }, [scrollY]);

//   return { keyLightPos, fillLightPos };
// };

// Mobile-optimized lighting configuration
const MOBILE_LIGHTING_CONFIG = {
  // Optimized for mobile camera position: [0, -1.6, -2] and target: [0, -1.6, -7.4]
  KEY_LIGHT: {
    POSITION: [-1.2, -0.8, -3] as [number, number, number], // Top-left, closer to camera
    INTENSITY: 2.0, // Brighter for better logo visibility
  },
  FILL_LIGHT: {
    POSITION: [1.0, -2.2, -4] as [number, number, number], // Bottom-right, lighting from below
    INTENSITY: 0.8, // Stronger fill light for mobile
  },
  RIM_LIGHT: {
    POSITION: [0, -1.0, -8] as [number, number, number], // Behind logo, creates edge lighting
    INTENSITY: 1.2,
  },
  AMBIENT: {
    INTENSITY: 0.2, // Slightly brighter ambient for mobile
  },
} as const;

const useMobileLighting = () => {
  return {
    keyLightPos: MOBILE_LIGHTING_CONFIG.KEY_LIGHT.POSITION,
    fillLightPos: MOBILE_LIGHTING_CONFIG.FILL_LIGHT.POSITION,
    rimLightPos: MOBILE_LIGHTING_CONFIG.RIM_LIGHT.POSITION,
    keyIntensity: MOBILE_LIGHTING_CONFIG.KEY_LIGHT.INTENSITY,
    fillIntensity: MOBILE_LIGHTING_CONFIG.FILL_LIGHT.INTENSITY,
    rimIntensity: MOBILE_LIGHTING_CONFIG.RIM_LIGHT.INTENSITY,
    ambientIntensity: MOBILE_LIGHTING_CONFIG.AMBIENT.INTENSITY,
  };
};

const useDesktopLighting = () => {
  // Desktop uses existing mouse-based lighting
  const mouseLighting = useMouseBasedLighting();

  return {
    keyLightPos: mouseLighting.keyLightPos,
    fillLightPos: mouseLighting.fillLightPos,
    rimLightPos: [0, 0, -8] as [number, number, number], // Standard rim light
    keyIntensity: LIGHT_CONFIG.KEY_LIGHT.INTENSITY,
    fillIntensity: LIGHT_CONFIG.FILL_LIGHT.INTENSITY,
    rimIntensity: 0.8,
    ambientIntensity: LIGHT_CONFIG.AMBIENT.INTENSITY,
  };
};

const useCarvedLighting = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < BREAKPOINT_THRESHOLDS.XL,
  );

  // Update mobile state on resize using Tailwind XL breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINT_THRESHOLDS.XL);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileLighting = useMobileLighting();
  const desktopLighting = useDesktopLighting();

  return isMobile ? mobileLighting : desktopLighting;
};

const useScrollOffset = () => {
  const [scrollY, setScrollY] = useState(0);
  const lenisContext = useContext(LenisContext);

  useEffect(() => {
    const lenis = lenisContext?.lenis;

    if (lenis) {
      const handleLenisScroll = (e: { scroll: number }) => {
        setScrollY(e.scroll);
      };

      lenis.on("scroll", handleLenisScroll);
      return () => lenis.off("scroll", handleLenisScroll);
    } else {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenisContext]);

  return scrollY;
};

const getCurrentBreakpoint = (width: number) => {
  if (width >= BREAKPOINT_THRESHOLDS.XXL) return "XXL";
  if (width >= BREAKPOINT_THRESHOLDS.XL) return "XL";
  if (width >= BREAKPOINT_THRESHOLDS.LG) return "LG";
  if (width >= BREAKPOINT_THRESHOLDS.MD) return "MD";
  if (width >= BREAKPOINT_THRESHOLDS.SM) return "SM";
  return "DEFAULT";
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

const useMobileZoomEffect = (scrollY: number, baseFov: number) => {
  return useMemo(() => {
    const scrollDivisor = 1;
    const zoomThresholdScreens = 1.5;
    const maxZoomFactor = 2.5;
    const maxPositionOffset = 4;

    const scrollFactor = scrollY / (window.innerHeight * scrollDivisor);
    const zoomProgress = Math.min(scrollFactor / zoomThresholdScreens, 1);

    const targetFovMultiplier = 1 - zoomProgress * maxZoomFactor;
    const minFovRatio = 10 / baseFov;
    const safeFovMultiplier = Math.max(targetFovMultiplier, minFovRatio);

    return {
      fovMultiplier: safeFovMultiplier,
      positionOffset: zoomProgress * maxPositionOffset,
      isZoomComplete: zoomProgress >= 1,
    };
  }, [scrollY, baseFov]);
};

const useResponsiveCamera = (scrollY: number): CameraConfig => {
  const baseCameraConfig = useResponsiveCameraBase();
  const isMobileDevice = window.innerWidth < BREAKPOINT_THRESHOLDS.XL;
  const mobileZoom = useMobileZoomEffect(scrollY, baseCameraConfig.FOV);

  return useMemo(() => {
    if (isMobileDevice) {
      return {
        position: [
          baseCameraConfig.POSITION[0],
          baseCameraConfig.POSITION[1],
          baseCameraConfig.POSITION[2] - mobileZoom.positionOffset,
        ],
        target: baseCameraConfig.TARGET,
        fov: baseCameraConfig.FOV * mobileZoom.fovMultiplier,
      };
    }

    // Desktop: return base config without modifications
    return {
      position: baseCameraConfig.POSITION,
      target: baseCameraConfig.TARGET,
      fov: baseCameraConfig.FOV,
    };
  }, [baseCameraConfig, isMobileDevice, mobileZoom]);
};

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
  } = useCarvedLighting();
  const [isModelReady, setIsModelReady] = useState(false);
  const scrollY = useScrollOffset();
  const cameraConfig = useResponsiveCamera(scrollY);

  // Canvas readiness coordination
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

  // Report canvas readiness when model is ready and rendered
  useEffect(() => {
    if (isModelReady && !canvasReadinessReported.current) {
      // Small delay to ensure Canvas is actually rendered
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

          {/* Key Light - Main illumination */}
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

          {/* Fill Light - Softens shadows */}
          <directionalLight position={fillLightPos} intensity={fillIntensity} />

          {/* Rim Light - Creates edge definition */}
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
            <ErrorBoundary>
              <Model url="/models/logo4.glb" planeOpaque={planeOpaque} />
            </ErrorBoundary>
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
