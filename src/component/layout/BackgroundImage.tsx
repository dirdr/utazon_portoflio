import { useBackground } from "../../context/BackgroundContext";

export const BackgroundImage = () => {
  const { backgroundImage, isTransitioning } = useBackground();

  if (!backgroundImage) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* 16:9 Background Image spanning full height, constrained to viewport */}
        <div
          className="absolute inset-0 bg-cover bg-left bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            aspectRatio: "16 / 9",
            width: "min(100vw, calc(100vh * 16 / 9))",
            height: "100vh",
            left: "0",
          }}
        />

        {/* Main right-side fade to black gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black"
          style={{
            background:
              "linear-gradient(to right, transparent 40%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 80%, black 100%)",
          }}
        />

        {/* Top fade border */}
        <div 
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent" 
          style={{ height: '25vh' }}
        />

        {/* Bottom fade border */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent" 
          style={{ height: '25vh' }}
        />

        {/* Left fade border */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-black to-transparent" 
          style={{ width: '20vw' }}
        />
      </div>
    </div>
  );
};

