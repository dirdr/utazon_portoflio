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
      POSITION: [3, -0.5, -6.3] as [number, number, number],
      INTENSITY: 7,
      COLOR: 0xffffff,
    },
    LIGHT_2: {
      POSITION: [-3, 0.5, -6.3] as [number, number, number],
      INTENSITY: 7,
      COLOR: 0xffffff,
    },
  },
  AMBIENT: {
    INTENSITY: 0.1,
  },
  BLOOM: {
    INTENSITY: 1,
    LUMINANCE_THRESHOLD: 0.1,
    LUMINANCE_SMOOTHING: 0.9,
  },
  NOISE: {
    OPACITY: 0.02,
  },
} as const;

const CAMERA_CONFIG = {
  POSITION: {
    DESKTOP: [0, 0, -4] as [number, number, number],
    MOBILE: [0, -1.2, -2] as [number, number, number],
  },
  FOV: {
    DESKTOP: 50,
    MOBILE: 70,
  },
  TARGET: {
    DESKTOP: [0, 0, -7.4] as [number, number, number],
    MOBILE: [0, -0.8, -7.4] as [number, number, number],
  },
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

// Throttle utility for performance
const throttle = (func: Function, delay: number) => {
  let timeoutId: number | null = null;
  let lastExecTime = 0;

  return (...args: any[]) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func.apply(null, args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func.apply(null, args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime),
      ) as unknown as number;
    }
  };
};

// Error Boundary for 3D Model loading
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error("🚨 3D Model Error Boundary caught error:", error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 3D Model Error Details:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log("🔄 Error boundary activated - rendering fallback");
      return null; // Render nothing instead of crashing
    }

    return this.props.children;
  }
}

type ModelProps = {
  url: string;
  planeOpaque?: boolean;
};

function Model({ url, planeOpaque = false }: ModelProps) {
  const preloadedGltf = getPreloadedModel(url);
  const gltf = (preloadedGltf || useGLTF(url)) as GLTF;
  const logoRef = useRef<THREE.Object3D>(null);
  const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material>>(
    new Map(),
  );
  const originalPositionsRef = useRef<Map<THREE.Object3D, THREE.Vector3>>(
    new Map(),
  );
  const meshCacheRef = useRef<Map<string, THREE.Mesh>>(new Map());

  const isUsingPreloaded = isModelPreloaded(url);

  const scrollY = useScrollOffset();

  useEffect(() => {
    if (isUsingPreloaded) {
      console.log("✅ Using preloaded 3D model for About page!");
    } else {
      console.log(
        "⚠️ Loading 3D model on-demand (preload may not be complete)",
      );
    }
  }, [isUsingPreloaded]);

  const logoYOffset = useMemo(() => {
    const isMobile = window.innerWidth < 1280; // xl breakpoint
    const scrollDivisor = isMobile ? 1.5 : 5; // Much higher scroll sensitivity on mobile
    const maxOffset = isMobile ? 8 : 3.8; // Much higher max offset on mobile

    const scrollFactor = scrollY / (window.innerHeight * scrollDivisor);
    return Math.min(scrollFactor * maxOffset, maxOffset);
  }, [scrollY]);
  useEffect(() => {
    if (gltf.scene) {
      const logoMesh = gltf.scene.getObjectByName("LOGO");
      const planeMesh = gltf.scene.getObjectByName("PLANE");

      if (planeMesh && !meshCacheRef.current.has("PLANE")) {
        meshCacheRef.current.set("PLANE", planeMesh as THREE.Mesh);
        planeMesh.traverse((child) => {
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

        logoMesh.traverse((child) => {
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

const useCarvedLighting = () => {
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

  const handleMouseMove = useCallback(
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
    [],
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return { keyLightPos, fillLightPos };
};

const useScrollOffset = () => {
  const [scrollY, setScrollY] = useState(0);
  const lenisContext = useContext(LenisContext);

  useEffect(() => {
    const lenis = lenisContext?.lenis;

    if (lenis) {
      const handleLenisScroll = (e: any) => {
        setScrollY(e.scroll);
      };

      lenis.on("scroll", handleLenisScroll);
      return () => lenis.off("scroll", handleLenisScroll);
    } else {
      // Fallback to native scroll if Lenis not available
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [lenisContext]);

  return scrollY;
};

const useResponsiveFOV = () => {
  const [fov, setFOV] = useState(CAMERA_CONFIG.FOV.DESKTOP);

  useEffect(() => {
    const updateFOV = () => {
      const isMobile = window.innerWidth < 1280; // xl breakpoint
      setFOV(isMobile ? CAMERA_CONFIG.FOV.MOBILE : CAMERA_CONFIG.FOV.DESKTOP);
    };

    updateFOV();
    window.addEventListener("resize", updateFOV);
    return () => window.removeEventListener("resize", updateFOV);
  }, []);

  return fov;
};

const useResponsiveCameraPosition = () => {
  const [position, setPosition] = useState(CAMERA_CONFIG.POSITION.DESKTOP);
  const [target, setTarget] = useState(CAMERA_CONFIG.TARGET.DESKTOP);

  useEffect(() => {
    const updateCameraPosition = () => {
      const isMobile = window.innerWidth < 1280; // xl breakpoint
      setPosition(
        isMobile
          ? CAMERA_CONFIG.POSITION.MOBILE
          : CAMERA_CONFIG.POSITION.DESKTOP,
      );
      setTarget(
        isMobile ? CAMERA_CONFIG.TARGET.MOBILE : CAMERA_CONFIG.TARGET.DESKTOP,
      );
    };

    updateCameraPosition();
    window.addEventListener("resize", updateCameraPosition);
    return () => window.removeEventListener("resize", updateCameraPosition);
  }, []);

  return { position, target };
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
  const fov = useResponsiveFOV();
  const { position, target } = useResponsiveCameraPosition();

  useEffect(() => {
    const checkModelReady = () => {
      if (isModelPreloaded("/models/logo3.glb")) {
        console.log("✅ logo3.glb is preloaded and ready!");
        setIsModelReady(true);
      } else {
        console.log("⚠️ logo3.glb not preloaded yet, waiting...");
        // Check periodically if model becomes available
        const checkInterval = setInterval(() => {
          if (isModelPreloaded("/models/logo3.glb")) {
            console.log("✅ logo3.glb became available during check!");
            setIsModelReady(true);
            clearInterval(checkInterval);
          }
        }, 100);

        // Fallback timeout - show background even without model
        const fallbackTimer = setTimeout(() => {
          console.log(
            "⏰ Fallback timeout - showing background without waiting for model",
          );
          setIsModelReady(true);
          clearInterval(checkInterval);
        }, 3000); // Increased from 1s to 3s for better loading

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
              <Model url="/models/logo3.glb" planeOpaque={planeOpaque} />
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
