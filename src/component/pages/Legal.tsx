import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { useBackgroundImageStore } from "../../hooks/useBackgroundImageStore";
import { useEffect } from "react";
import backgroundImage from "../../assets/images/background.webp";

export const Legal = () => {
  const { t } = useTranslation();
  const setBackgroundImage = useBackgroundImageStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(backgroundImage, "Legal");
    return () => setBackgroundImage(null, "Legal");
  }, [setBackgroundImage]);

  return (
    <div className="min-h-screen my-8 lg:my-32">
      <Container className="justify-center max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-12 md:mb-16 text-center">
          <h1 className="font-nord text-xl md:text-2xl 2xl:text-3xl font-bold italic text-white mb-1">
            {t("legal.title")}
          </h1>
          <p className="font-nord text-base 2xl:text-lg font-thin text-gray mb-8">
            {t("legal.lastUpdated")} : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-white uppercase text-sm mb-6">
              {t("legal.editor.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-nord text-white uppercase text-sm">Nom</h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.name")}
                </p>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase text-sm">
                  Statut
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.status")}
                </p>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase text-sm">
                  Email
                </h3>
                <a
                  href="mailto:utazoncontact@gmail.com"
                  className="font-neue text-gray text-base hover:text-white transition-colors"
                >
                  {t("legal.editor.email")}
                </a>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase text-sm">
                  Téléphone
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.phone")}
                </p>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase text-sm">
                  Code SIRET
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.siret")}
                </p>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase text-sm">
                  Activité
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.activity")}
                </p>
              </div>
              <div>
                <h3 className="font-nord text-white uppercase text-sm">
                  Code NAF
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.nafCode")}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-white uppercase text-sm mb-6">
              {t("legal.hosting.title")}
            </h2>
            <div className="space-y-3">
              <p className="font-neue text-gray text-base italic">
                {t("legal.hosting.provider")}
              </p>
              <p className="font-neue text-gray text-base italic">
                {t("legal.hosting.address")}
              </p>
              <p className="font-neue text-gray text-base italic">
                {t("legal.hosting.contact")}
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-white uppercase text-sm mb-6">
              {t("legal.intellectual.title")}
            </h2>
            <p className="font-neue text-sm sm:text-base 2xl:text-lg text-gray leading-relaxed">
              {t("legal.intellectual.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-white uppercase text-sm mb-6">
              {t("legal.liability.title")}
            </h2>
            <p className="font-neue text-sm sm:text-base 2xl:text-lg text-gray leading-relaxed">
              {t("legal.liability.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-white uppercase text-sm mb-6">
              {t("legal.data.title")}
            </h2>
            <p className="font-neue text-sm sm:text-base 2xl:text-lg text-gray leading-relaxed">
              {t("legal.data.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-white uppercase text-sm mb-6">
              {t("legal.cookies.title")}
            </h2>
            <p className="font-neue text-sm sm:text-base 2xl:text-lg text-gray leading-relaxed">
              {t("legal.cookies.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-white uppercase text-sm mb-6">
              {t("legal.law.title")}
            </h2>
            <p className="font-neue text-sm sm:text-base 2xl:text-lg text-gray leading-relaxed">
              {t("legal.law.content")}
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
};
