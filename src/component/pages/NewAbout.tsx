import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { Container } from "../layout/Container";
import { GLTF } from "three-stdlib";
import * as THREE from "three";

const LIGHT_CONFIG = {
  BOUNDS: {
    X: [-1.5, 1.5] as const,
    Y: [-1.5, 1.5] as const,
  },
  SENSITIVITY: 0.5,

  DISTANCE_FROM_CENTER: 1.5,
  BASE_Z: -6, // Between camera (-3) and logo (-7.4)

  KEY_LIGHT: {
    INTENSITY: 1.5,
  },

  FILL_LIGHT: {
    INTENSITY: 0.3,
  },

  AMBIENT: {
    INTENSITY: 0.1,
  },

  BLOOM: {
    INTENSITY: 5,
    LUMINANCE_THRESHOLD: 0.1,
    LUMINANCE_SMOOTHING: 0.9,
  },

  NOISE: {
    OPACITY: 0.02,
  },
} as const;

const CAMERA_CONFIG = {
  POSITION: [0, 0, -4] as [number, number, number],
  FOV: 50,
  TARGET: [0, 0, -7.4] as [number, number, number],
} as const;

const SHADOW_CONFIG = {
  MAP_SIZE: 4096, // High-resolution shadow maps
  CAMERA_BOUNDS: {
    LEFT: -2,
    RIGHT: 2,
    TOP: 2,
    BOTTOM: -2,
    NEAR: 0.1,
    FAR: 15,
  },
  BIAS: -0.0008, // Fine-tuned to eliminate artifacts
  RADIUS: 2, // Soft shadow edges
} as const;

// Debug visualization configuration
const DEBUG_CONFIG = {
  SPHERES: {
    PRIMARY_LIGHT: { size: 0.12, color: "red", label: "Primary Grazing Light" },
    FILL_LIGHT: { size: 0.08, color: "blue", label: "Fill Light" },
    RIM_LIGHTS: { size: 0.06, color: "green", label: "Rim Light" },
    EDGE_LIGHTS: { size: 0.06, color: "yellow", label: "Edge Light" },
    LOGO_CENTER: { size: 0.05, color: "white", label: "Logo Center" },
  },
} as const;

type ModelProps = {
  url: string;
  planeOpaque?: boolean;
};

function Model({ url, planeOpaque = false }: ModelProps) {
  const gltf = useGLTF(url) as GLTF;
  const logoRef = useRef<THREE.Object3D>(null);
  const originalMaterialsRef = useRef<Map<THREE.Mesh, THREE.Material>>(
    new Map(),
  );

  useEffect(() => {
    if (gltf.scene) {
      const logoMesh = gltf.scene.getObjectByName("LOGO");
      const planeMesh = gltf.scene.getObjectByName("PLANE");

      if (planeMesh) {
        planeMesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Store original material if not already stored
            if (!originalMaterialsRef.current.has(child)) {
              originalMaterialsRef.current.set(child, child.material);
            }
          }
        });
      }

      if (logoMesh) {
        logoMesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.receiveShadow = true;
            child.castShadow = true;

            // Simple material for carved surface lighting
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
    }
  }, [gltf]);

  useEffect(() => {
    if (gltf.scene) {
      const planeMesh = gltf.scene.getObjectByName("PLANE");

      if (planeMesh) {
        planeMesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (planeOpaque) {
              child.material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: false,
              });
              child.receiveShadow = false;
              child.castShadow = false;
              console.log("PLANE set to opaque dark gray");
            } else {
              const originalMaterial = originalMaterialsRef.current.get(child);
              if (originalMaterial) {
                child.material = originalMaterial;
                child.receiveShadow = true;
                child.castShadow = true;
                console.log("PLANE restored to original material");
              }
            }
          }
        });
      }
    }
  }, [gltf.scene, planeOpaque]);

  return (
    <>
      <primitive object={gltf.scene} scale={1.5} />
      <object3D ref={logoRef} position={[0, 0, 0]} />
    </>
  );
}

const useCarvedLighting = () => {
  const [keyLightPos, setKeyLightPos] = useState<[number, number, number]>([
    0,
    0,
    LIGHT_CONFIG.BASE_Z,
  ]);
  const [fillLightPos, setFillLightPos] = useState<[number, number, number]>([
    0,
    0,
    LIGHT_CONFIG.BASE_Z,
  ]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1 range
      const normalizedX = (event.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (event.clientY / window.innerHeight) * 2 - 1;

      // Apply bounds and sensitivity
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

      // Fill light follows cursor (illuminates where you look)
      setFillLightPos([
        boundedX * distance,
        boundedY * distance,
        LIGHT_CONFIG.BASE_Z,
      ]);

      // Key light opposes cursor (creates shadows from opposite side)
      setKeyLightPos([
        -boundedX * distance,
        -boundedY * distance,
        LIGHT_CONFIG.BASE_Z,
      ]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return { keyLightPos, fillLightPos };
};

// Debug sphere component for light visualization
type DebugSphereProps = {
  position: [number, number, number];
  size: number;
  color: string;
  label?: string;
};

const DebugSphere = ({ position, size, color }: DebugSphereProps) => (
  <mesh position={position}>
    <sphereGeometry args={[size]} />
    <meshBasicMaterial color={color} />
  </mesh>
);

// Clean debug visualization for minimal lighting setup
type LightDebugProps = {
  keyLightPos: [number, number, number];
  fillLightPos: [number, number, number];
  visible: boolean;
};

const LightDebugVisualization = ({
  keyLightPos,
  fillLightPos,
  visible,
}: LightDebugProps) => {
  if (!visible) return null;

  // Console log light positions for debugging
  console.log("=== MINIMAL LIGHTING DEBUG ===");
  console.log("🔴 Key Light (opposes cursor):", keyLightPos);
  console.log("🔵 Fill Light (follows cursor):", fillLightPos);
  console.log("⚪ Logo Center:", CAMERA_CONFIG.TARGET);
  console.log("📷 Camera:", CAMERA_CONFIG.POSITION);
  console.log("===============================");

  return (
    <>
      {/* Key Light - RED (opposes cursor) */}
      <DebugSphere
        position={keyLightPos}
        size={0.08}
        color="red"
        label="Key Light"
      />

      {/* Fill Light - BLUE (follows cursor) */}
      <DebugSphere
        position={fillLightPos}
        size={0.08}
        color="blue"
        label="Fill Light"
      />

      {/* Logo Center - WHITE */}
      <DebugSphere
        position={CAMERA_CONFIG.TARGET}
        size={0.05}
        color="white"
        label="Logo Center"
      />
    </>
  );
};

export const NewAbout = () => {
  const { keyLightPos, fillLightPos } = useCarvedLighting();
  const [debugVisible, setDebugVisible] = useState(false);
  const [planeOpaque, setPlaneOpaque] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "KeyD") {
        setDebugVisible((prev) => !prev);
      }
      if (event.code === "KeyF") {
        setPlaneOpaque((prev) => !prev);
      }
      if (event.code === "KeyB") {
        setBloomEnabled((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <Container className="flex items-center justify-center">
      <div
        className={`w-256 h-256 max-w-full ${debugVisible ? "border-4 border-red-500" : ""}`}
      >
        <Canvas
          shadows
          camera={{ position: CAMERA_CONFIG.POSITION, fov: CAMERA_CONFIG.FOV }}
          gl={{
            antialias: true,
            shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap },
          }}
        >
          <OrbitControls
            target={CAMERA_CONFIG.TARGET}
            enablePan={false}
            enableZoom={false}
            enableRotate={false}
          />

          {/* Minimal 2-light setup for optimal carved surface visibility */}

          {/* Ambient light - minimal base illumination */}
          <ambientLight intensity={LIGHT_CONFIG.AMBIENT.INTENSITY} />

          {/* Key light - creates shadows (opposes cursor) */}
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

          {/* Fill light - illuminates where you look (follows cursor) */}
          <directionalLight
            position={fillLightPos}
            intensity={LIGHT_CONFIG.FILL_LIGHT.INTENSITY}
          />

          {/* Simple light debug visualization */}
          <LightDebugVisualization
            keyLightPos={keyLightPos}
            fillLightPos={fillLightPos}
            visible={debugVisible}
          />

          <Suspense fallback={null}>
            <Model url="/models/logo.glb" planeOpaque={planeOpaque} />
          </Suspense>

          {/* Post-processing effects - Bloom & Noise */}
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
    </Container>
  );
};
