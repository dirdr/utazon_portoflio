import { useVideo } from "../../contexts/video";
import { Button } from "../common/Button";
import { LineSweepText } from "../common/LineSweepText";
import { ROUTES } from "../../constants/routes";

export const Home = () => {
  const { isLoading } = useVideo();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen">
      <section 
        className="absolute bottom-0 pl-12 pb-16 w-180"
        aria-labelledby="location-heading"
      >
        <address className="not-italic">
          <p id="location-heading" className="text-muted text-xl mb-6">Paris, France</p>
        </address>
        <LineSweepText
          className="font-nord text-6xl italic text-muted"
          duration={6}
        >
          3D Artist and Motion Designer
        </LineSweepText>
      </section>

      <section 
        className="absolute bottom-0 right-0 w-140 pb-16 pr-12"
        aria-labelledby="intro-heading"
      >
        <div className="space-y-4">
          <p id="intro-heading" className="text-xl text-gray mb-10">
            Depuis plus de 4 ans, je conçois des expériences visuelles
            immersives et percutantes pour des marques, des agences et des
            artistes.
          </p>
          <nav className="flex gap-8" aria-label="Actions principales">
            <Button href={ROUTES.PROJECTS}>PROJETS</Button>
            <Button href={ROUTES.SHOWREEL}>SHOWREEL</Button>
          </nav>
        </div>
      </section>
    </main>
  );
};
