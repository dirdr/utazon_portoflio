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
          <h1 className="font-nord text-4xl font-bold text-white mb-6">
            {t("legal.title")}
          </h1>
          <p className="font-neue text-white/60 text-sm">
            {t("legal.lastUpdated")} : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-sm font-bold text-white mb-6">
              {t("legal.editor.title")}
            </h2>
            <div className="space-y-4 font-neue text-white/80">
              <p>
                <strong className="text-white">Nom :</strong>{" "}
                <span className="text-white/80">{t("legal.editor.name")}</span>
              </p>
              <p>
                <strong className="text-white">Statut :</strong>{" "}
                <span className="text-white/80">
                  {t("legal.editor.status")}
                </span>
              </p>
              <p>
                <strong className="text-white">Email :</strong>{" "}
                <a
                  href="mailto:utazoncontact@gmail.com"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {t("legal.editor.email")}
                </a>
              </p>
              <p>
                <strong className="text-white">Téléphone :</strong>{" "}
                <span className="text-white/80">{t("legal.editor.phone")}</span>
              </p>
              <p>
                <strong className="text-white">Code SIRET :</strong>{" "}
                <span className="text-white/80">{t("legal.editor.siret")}</span>
              </p>
              <p>
                <strong className="text-white">Activité :</strong>{" "}
                <span className="text-white/80">
                  {t("legal.editor.activity")}
                </span>
              </p>
              <p>
                <strong className="text-white">Code NAF :</strong>{" "}
                <span className="text-white/80">
                  {t("legal.editor.nafCode")}
                </span>
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-sm font-bold text-white mb-6">
              {t("legal.hosting.title")}
            </h2>
            <div className="space-y-3 font-neue text-white/80">
              <p className="text-white/60 italic">
                {t("legal.hosting.provider")}
              </p>
              <p className="text-white/60 italic">
                {t("legal.hosting.address")}
              </p>
              <p className="text-white/60 italic">
                {t("legal.hosting.contact")}
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-sm font-bold text-white mb-6">
              {t("legal.intellectual.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.intellectual.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-sm font-bold text-white mb-6">
              {t("legal.liability.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.liability.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-sm font-bold text-white mb-6">
              {t("legal.data.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.data.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-sm font-bold text-white mb-6">
              {t("legal.cookies.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.cookies.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-sm font-bold text-white mb-6">
              {t("legal.law.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.law.content")}
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
};
