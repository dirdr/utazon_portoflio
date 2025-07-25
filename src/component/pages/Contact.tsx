import { useEffect } from "react";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { Container } from "../layout/Container";
import backgroundImage from "../../assets/images/background.webp";

export const Contact = () => {
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(backgroundImage, 'Contact');
    return () => setBackgroundImage(null, 'Contact');
  }, [setBackgroundImage]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Container>
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Contact</h1>
          <p className="text-muted">
            Get in touch - contact form coming soon...
          </p>
        </div>
      </Container>
    </div>
  );
};
