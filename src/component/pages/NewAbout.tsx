import { Suspense, useEffect, useState, useRef, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { useContactModal } from "../../hooks/useContactModal";
import { VideoShowcase } from "../showcase/VideoShowcase";

const LIGHT_CONFIG = {
  BOUNDS: {
    X: [-1.5, 1.5] as const,
    Y: [-1.5, 1.5] as const,
  },
  SENSITIVITY: 0.5,

  DISTANCE_FROM_CENTER: 1.5,
  BASE_Z: -6,

  KEY_LIGHT: {
    INTENSITY: 1.5,
  },

  FILL_LIGHT: {
    INTENSITY: 0.3,
  },

  POINT_LIGHTS: {
    LIGHT_1: {
      POSITION: [2.5, -0.5, -6] as [number, number, number],
      INTENSITY: 0.8,
      COLOR: 0xffffff,
    },
    LIGHT_2: {
      POSITION: [-3, 0.2, -6] as [number, number, number],
      INTENSITY: 0.8,
      COLOR: 0xffffff,
    },
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
  MAP_SIZE: 4096,
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

      setFillLightPos([
        boundedX * distance,
        boundedY * distance,
        LIGHT_CONFIG.BASE_Z,
      ]);

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

type DebugSphereProps = {
  position: [number, number, number];
  size: number;
  color: string;
  label?: string;
};

const DebugSphere = ({ position, size, color }: DebugSphereProps) => (
  <mesh position={position}>
    <sphereGeometry args={[size]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

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

  console.log("=== MINIMAL LIGHTING DEBUG ===");
  console.log("🔴 Key Light (opposes cursor):", keyLightPos);
  console.log("🔵 Fill Light (follows cursor):", fillLightPos);
  console.log("💡 Point Light 1:", LIGHT_CONFIG.POINT_LIGHTS.LIGHT_1.POSITION);
  console.log("💡 Point Light 2:", LIGHT_CONFIG.POINT_LIGHTS.LIGHT_2.POSITION);
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

      <DebugSphere
        position={fillLightPos}
        size={0.08}
        color="blue"
        label="Fill Light"
      />

      {/* Point Lights - WHITE */}
      <DebugSphere
        position={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_1.POSITION}
        size={0.06}
        color="white"
        label="Point Light 1"
      />

      <DebugSphere
        position={LIGHT_CONFIG.POINT_LIGHTS.LIGHT_2.POSITION}
        size={0.06}
        color="white"
        label="Point Light 2"
      />

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
  const { t } = useTranslation();

  const titleContent = useMemo(() => {
    const title = t("home.title");
    return title.includes("\n")
      ? title.split("\n").map((line, index) => (
          <span key={index} className="block">
            {line}
          </span>
        ))
      : title;
  }, [t]);

  const { openContactModal } = useContactModal();

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
    <>
      <div className="mb-32">
        <div
          className={`relative w-screen h-256 max-w-full ${debugVisible ? "border-4 border-red-500" : ""}`}
        >
          <Canvas
            shadows
            camera={{
              position: CAMERA_CONFIG.POSITION,
              fov: CAMERA_CONFIG.FOV,
            }}
            gl={{
              antialias: true,
            }}
          >
            <OrbitControls
              target={CAMERA_CONFIG.TARGET}
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

            <LightDebugVisualization
              keyLightPos={keyLightPos}
              fillLightPos={fillLightPos}
              visible={debugVisible}
            />

            <Suspense fallback={null}>
              <Model url="/models/logo3.glb" planeOpaque={planeOpaque} />
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

          {/* Overlay layer */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-32 left-12 pointer-events-auto max-w-md">
              <header className="mb-8">
                <h1 className="font-nord text-3xl xl:text-4xl italic text-muted tracking-tight">
                  <LineSweepText duration={6}>{titleContent}</LineSweepText>
                </h1>
              </header>

              <p className="text-base text-gray mb-10">
                {t("home.description")}
              </p>

              <div className="flex justify-start">
                <Button
                  glint={true}
                  as="button"
                  className="text-xs sm:text-base px-8 py-3 inline-block w-auto"
                  onClick={openContactModal}
                  proximityIntensity={true}
                >
                  {t("nav.contact")}
                </Button>
              </div>
            </div>
            <div className="absolute bottom-32 right-12 pointer-events-auto max-w-md">
              <h2 className="text-white text-sm 2xl-test-base font-nord mb-2">
                {t("about.services.motionDesign.title")}
              </h2>
              <p className="text-muted text-base 2xl-test-lg font-neue">
                {t("about.services.motionDesign.description")}
              </p>
              <div className="h-px bg-gray-600 my-10"></div>

              <h2 className="text-white text-sm 2xl-test-base font-nord mb-2">
                {t("about.services.artDirection.title")}
              </h2>
              <p className="text-muted text-base 2xl-test-lg font-neue">
                {t("about.services.artDirection.description")}
              </p>
              <div className="h-px bg-gray-600 my-10"></div>

              <h2 className="text-white text-sm 2xl-test-base font-nord mb-2">
                {t("about.services.editingCompositing.title")}
              </h2>
              <p className="text-muted text-base 2xl-test-lg font-neue">
                {t("about.services.editingCompositing.description")}
              </p>
              <div className="h-px bg-gray-600 my-10"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-4 lg:mx-32">
        <VideoShowcase
          data={{
            type: "video",
            id: "showreel-about",
            order: 1,
            video: {
              src: "showreel.mp4",
              title: "Showreel",
              startTime: 0.3,
            },
          }}
          border={true}
        />
        <div className="flex-1 flex items-center justify-center mt-10">
          <p className="text-muted text-base 2xl:text-lg font-neue">
            Cinema 4D, Blender, Unreal Engine 5, After Effects, DaVinci Resolve
          </p>
        </div>
        <section className="w-full my-32 lg:my-48">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-muted font-nord text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wide mb-8">
              <LineSweepText duration={4}>
                {t("about.commitment")}
              </LineSweepText>
            </h2>
            <p className="text-white text-sm md:text-base xl:text-lg leading-relaxed mb-16">
              {t("about.commitmentDesc")}
            </p>
            <div className="flex justify-center">
              <Button
                glint={true}
                as="button"
                className="text-xs sm:text-sm md:text-base lg:text-lg px-8 py-3 inline-block w-auto"
                onClick={openContactModal}
                proximityIntensity={true}
              >
                {t("nav.contact")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
