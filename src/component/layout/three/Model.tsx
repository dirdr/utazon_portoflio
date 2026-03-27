import { useEffect, useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import * as THREE from "three";
import { getPreloadedModel } from "../../../hooks/usePreloadAssets";
import { useScrollOffset } from "../../../hooks/useScrollOffset";

type ModelProps = {
  url: string;
  planeOpaque?: boolean;
};

export function Model({ url, planeOpaque = false }: ModelProps) {
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
    if (scrollY === 0) return 0;
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
