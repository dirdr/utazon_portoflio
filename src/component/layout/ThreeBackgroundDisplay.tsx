import React, {
  Suspense,
  useEffect,
  useState,
  useRef,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import {
  getPreloadedModel,
  isModelPreloaded,
} from "../../hooks/usePreloadAssets";
import { LenisContext } from "../../contexts/LenisContext";

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
      TARGET: [0, -1.8, -7.4] as [number, number, number],
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
    const isMobile = window.innerWidth < BREAKPOINT_THRESHOLDS.XL;
    const scrollDivisor = isMobile ? 1.5 : 5;
    const maxOffset = isMobile ? 8 : 4.5;

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

const useScrollBasedLighting = (scrollY: number) => {
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

  useEffect(() => {
    const baseOffsetX = 0.8;
    const baseOffsetY = -0.6;

    const circleRadius = 1.0; // Radius of the circular motion
    const rotationSpeed = 3; // Number of full rotations per viewport height

    const scrollAngle =
      (scrollY / window.innerHeight) * Math.PI * 2 * rotationSpeed;

    const keyLightAngle = scrollAngle;
    const fillLightAngle = scrollAngle + Math.PI; // Opposite side of circle

    const keyLightX = baseOffsetX + Math.cos(keyLightAngle) * circleRadius;
    const keyLightY = baseOffsetY + Math.sin(keyLightAngle) * circleRadius;

    const fillLightX = baseOffsetX + Math.cos(fillLightAngle) * circleRadius;
    const fillLightY = baseOffsetY + Math.sin(fillLightAngle) * circleRadius;

    const boundedKeyX = Math.max(
      LIGHT_CONFIG.BOUNDS.X[0],
      Math.min(LIGHT_CONFIG.BOUNDS.X[1], keyLightX),
    );
    const boundedKeyY = Math.max(
      LIGHT_CONFIG.BOUNDS.Y[0],
      Math.min(LIGHT_CONFIG.BOUNDS.Y[1], keyLightY),
    );

    const boundedFillX = Math.max(
      LIGHT_CONFIG.BOUNDS.X[0],
      Math.min(LIGHT_CONFIG.BOUNDS.X[1], fillLightX),
    );
    const boundedFillY = Math.max(
      LIGHT_CONFIG.BOUNDS.Y[0],
      Math.min(LIGHT_CONFIG.BOUNDS.Y[1], fillLightY),
    );

    setKeyLightPos([boundedKeyX, boundedKeyY, LIGHT_CONFIG.BASE_Z]);
    setFillLightPos([boundedFillX, boundedFillY, LIGHT_CONFIG.BASE_Z]);
  }, [scrollY]);

  return { keyLightPos, fillLightPos };
};

const useCarvedLighting = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < BREAKPOINT_THRESHOLDS.XL,
  );
  const scrollY = useScrollOffset();

  // Update mobile state on resize using Tailwind XL breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < BREAKPOINT_THRESHOLDS.XL);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mouseLighting = useMouseBasedLighting();
  const scrollLighting = useScrollBasedLighting(scrollY);

  return isMobile ? scrollLighting : mouseLighting;
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

// Unified responsive camera hook that handles all camera properties
const useResponsiveCamera = () => {
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

  return {
    position: cameraConfig.POSITION,
    target: cameraConfig.TARGET,
    fov: cameraConfig.FOV,
  };
};

interface ThreeBackgroundDisplayProps {
  planeOpaque?: boolean;
  bloomEnabled?: boolean;
}

export const ThreeBackgroundDisplay: React.FC<ThreeBackgroundDisplayProps> = ({
  planeOpaque = false,
  bloomEnabled = true,
}) => {
  const { keyLightPos, fillLightPos } = useCarvedLighting();
  const [isModelReady, setIsModelReady] = useState(false);
  const { position, target, fov } = useResponsiveCamera();

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

  if (!isModelReady) {
    return (
      <div className="fixed inset-0" style={{ zIndex: -20 }}>
        <div className="w-full h-full bg-black" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0" style={{ zIndex: -20 }}>
      <div className="w-full h-full">
        <Canvas
          shadows
          camera={{
            position: position,
            fov: fov,
          }}
          gl={{
            antialias: window.devicePixelRatio <= 1,
            powerPreference: "high-performance",
            alpha: false,
            stencil: false,
          }}
        >
          <OrbitControls
            target={target}
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />

          <ambientLight intensity={LIGHT_CONFIG.AMBIENT.INTENSITY} />

          <directionalLight
            position={keyLightPos}
            intensity={LIGHT_CONFIG.KEY_LIGHT.INTENSITY}
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

          <directionalLight
            position={fillLightPos}
            intensity={LIGHT_CONFIG.FILL_LIGHT.INTENSITY}
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
