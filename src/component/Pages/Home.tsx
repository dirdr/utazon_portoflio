import { useVideo } from "../common/VideoContext";
import { Button } from "../common/Button";
import { LightSweepText } from "../common/LineSweepText";

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
    <div className="relative w-full h-screen">
      <section className="absolute bottom-0 pl-12 pb-12 w-180">
        <address className="not-italic">
          <p className="text-muted text-lg mb-6">Paris, France</p>
        </address>
        <LightSweepText
          className="font-nord text-6xl italic text-muted"
          duration={6}
        >
          3D Artist and Motion Designer
        </LightSweepText>{" "}
      </section>

      <section className="absolute bottom-0 right-0 w-150 pb-12 pr-12">
        <div className="space-y-4">
          <p className="text-xl text-gray mb-10">
            Depuis plus de 4 ans, je conçois des expériences visuelles
            immersives et percutantes pour des marques, des agences et des
            artistes.
          </p>
          <nav className="flex gap-8">
            <Button href="/projects">PROJETS</Button>
            <Button href="/showreel">SHOWREEL</Button>
          </nav>
        </div>
      </section>
    </div>
  );
};
