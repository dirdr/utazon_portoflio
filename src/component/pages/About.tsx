import { useEffect } from "react";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { Container } from "../layout/Container";
import backgroundImage from "../../assets/images/background.webp";

export const About = () => {
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(backgroundImage, 'About');
    return () => setBackgroundImage(null, 'About');
  }, [setBackgroundImage]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container>
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">À propos</h1>
          <p className="text-muted">About page coming soon...</p>
        </div>
      </Container>
    </div>
  );
};
