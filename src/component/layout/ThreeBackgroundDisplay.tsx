import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
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
import { useLenis } from "lenis/react";
import { useCanvasComponent } from "../../hooks/useCanvasReadiness";
import { mouseTracker } from "../../utils/mouseTracker";

interface CameraConfig {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

interface CameraControllerProps {
  config: CameraConfig;
}

function CameraController({ config }: CameraControllerProps) {
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
    XL: {
      POSITION: [0, 0, -4] as [number, number, number],
      FOV: 60,
      TARGET: [0, 0, -7.4] as [number, number, number],
    },
    XXL: {
      POSITION: [0, 0.2, -4.5] as [number, number, number],
      FOV: 55,
      TARGET: [0, 0.1, -7.4] as [number, number, number],
    },
  },
} as const;

const BREAKPOINT_THRESHOLDS = {
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
    const scrollDivisor = 5;
    const maxOffset = 4.5;
    const scrollFactor = scrollY / (window.innerHeight * scrollDivisor);
    return Math.min(scrollFactor * maxOffset, maxOffset);
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

const calculateLightingPositions = (clientX?: number, clientY?: number) => {
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

  const throttledHandleMouseMove = useCallback(
    throttle((event: MouseEvent) => {
      const { keyLightPos: newKeyPos, fillLightPos: newFillPos } =
        calculateLightingPositions(event.clientX, event.clientY);

      setKeyLightPos(newKeyPos);
      setFillLightPos(newFillPos);
    }, 16),
    [setFillLightPos, setKeyLightPos],
  );

  useEffect(() => {
    const initializeLighting = async () => {
      try {
        const currentPos = await mouseTracker.getCurrentPosition();

        const { keyLightPos: currentKeyPos, fillLightPos: currentFillPos } =
          calculateLightingPositions(currentPos.x, currentPos.y);

        setKeyLightPos(currentKeyPos);
        setFillLightPos(currentFillPos);
      } catch (error) {
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

const useDesktopLighting = () => {
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

const useScrollOffset = () => {
  const [scrollY, setScrollY] = useState(0);
  const lenis = useLenis();

  useEffect(() => {
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
  }, [lenis]);

  return scrollY;
};

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

const useResponsiveCamera = (): CameraConfig => {
  const baseCameraConfig = useResponsiveCameraBase();

  return useMemo(() => {
    return {
      position: baseCameraConfig.POSITION,
      target: baseCameraConfig.TARGET,
      fov: baseCameraConfig.FOV,
    };
  }, [baseCameraConfig]);
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
