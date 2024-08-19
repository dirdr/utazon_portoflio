import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { GroupProps } from "@react-three/fiber";
import { animated, useSpring } from "@react-spring/three";
import * as THREE from "three";
import { Fresnel, LayerMaterial } from "lamina";

type GLTFResult = GLTF & {
  nodes: {
    logo: THREE.Mesh;
  };
  materials: {
    ["Material.001"]: THREE.ShaderMaterial;
  };
};

interface LogoProps extends GroupProps {
  onAnimationFinish: () => void;
}

export default function Logo(props: LogoProps) {
  const { nodes } = useGLTF("/model/utazon_logo.glb") as GLTFResult;

  const logoAnimation = useSpring({
    from: {
      scale: [20, 20, 20],
      rotation: [Math.PI / 2, 0, Math.PI],
      opacity: 0,
    },
    to: [
      {
        scale: [40, 40, 40],
        rotation: [Math.PI / 2, 0, 0],
        opacity: 1,
      },
    ],
    config: {
      mass: 4,
      friction: 15,
      tension: 12,
    },
    onRest: props.onAnimationFinish,
  });

  return (
    <group {...props} dispose={null}>
      <animated.mesh
        position={[0, 0, -2]}
        geometry={nodes.logo.geometry}
        // @ts-expect-error Type not supported
        scale={logoAnimation.scale}
        // @ts-expect-error Type not supported
        rotation={logoAnimation.rotation}
      >
        <LayerMaterial lighting={"physical"} roughness={0.1} metalness={1}>
          <Fresnel color={"#ffffff"} alpha={0.6} power={0.5}></Fresnel>
        </LayerMaterial>
      </animated.mesh>
    </group>
  );
}

useGLTF.preload("/model/utazon_logo.glb");
