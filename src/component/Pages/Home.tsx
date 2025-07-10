import { useVideo } from "../common/VideoContext";
import { Button } from "../common/Button";

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
      <section className="absolute bottom-8 left-8  pb-8 w-180">
        <address className="not-italic">
          <p className="text-muted text-lg mb-6">Paris, France</p>
        </address>
        <h1 className="text-6xl italic text-muted">
          3D Artist and Motion Designer
        </h1>
      </section>

      <section className="absolute bottom-8 right-8 w-150 pb-8">
        <div className="space-y-4">
          <p className="text-xl text-gray mb-10">
            Depuis plus de 4 ans, je conçois des expériences visuelles
            immersives et percutantes pour des marques, des agences et des
            artistes.
          </p>
          <nav className="flex gap-4">
            <Button href="/contact">ME CONTACTER</Button>
            <Button href="/contact">SHOWREEL</Button>
          </nav>
        </div>
      </section>
    </div>
  );
};
