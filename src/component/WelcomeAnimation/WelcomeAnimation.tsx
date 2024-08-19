import { Canvas } from "@react-three/fiber";
import Logo from "../Logo/Logo";
import { Suspense, useState } from "react";
import { Environment } from "@react-three/drei";
import "./WelcomeAnimation.scss";

interface WelcomeAnimationProps {
  onAnimationFinish: () => void;
}

function WelcomeAnimation(props: WelcomeAnimationProps) {
  const handleLogoAnimationFinish = () => {
    setLogoFadeOut(true);
    setTimeout(() => {
      props.onAnimationFinish();
    }, 500);
  };

  const [logoFadeOut, setLogoFadeOut] = useState(false);

  return (
    <>
      <Canvas className={logoFadeOut ? "fade-animation" : ""}>
        <ambientLight intensity={0.5}></ambientLight>
        <Suspense fallback={<div>Loading...</div>}>
          <Logo onAnimationFinish={handleLogoAnimationFinish}></Logo>
        </Suspense>
        <Environment files={"/studio_hdri.exr"}></Environment>
      </Canvas>
    </>
  );
}

export default WelcomeAnimation;
