import { Button } from "../common/Button";
import { ROUTES } from "../../constants/routes";

export const About = () => {
  return (
    <div className="min-h-screen px-4 sm:px-16 py-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-6xl sm:text-8xl font-nord font-bold mb-6">
            À propos
          </h1>
          <p className="text-xl text-muted font-nord">
            3D Artist and Motion Designer basé à Paris
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-16 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-nord font-bold">Mon parcours</h2>
            <div className="space-y-4 text-lg text-gray">
              <p>
                Passionné par l'art numérique depuis plus de 4 ans, je me spécialise 
                dans la création d'expériences visuelles immersives et percutantes.
              </p>
              <p>
                Mon expertise couvre la modélisation 3D, l'animation, le motion design 
                et les effets visuels, permettant de donner vie aux idées les plus 
                ambitieuses.
              </p>
              <p>
                J'accompagne marques, agences et artistes dans la réalisation de 
                leurs projets créatifs, en alliant technique et vision artistique.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-nord font-bold">Compétences</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                "Modélisation 3D",
                "Animation",
                "Motion Design", 
                "Rendu",
                "Compositing",
                "Direction artistique"
              ].map((skill) => (
                <div 
                  key={skill}
                  className="p-4 border border-muted/20 rounded-lg bg-foreground/5"
                >
                  <span className="text-foreground font-nord">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="text-center border-t border-muted/20 pt-16">
          <h2 className="text-3xl font-nord font-bold mb-6">
            Prêt à collaborer ?
          </h2>
          <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
            Discutons de votre projet et créons ensemble quelque chose d'exceptionnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={ROUTES.CONTACT} variant="glint">
              ME CONTACTER
            </Button>
            <Button href={ROUTES.PROJECTS}>
              VOIR MES PROJETS
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
