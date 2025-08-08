import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useEffect } from "react";
import backgroundImage from "../../assets/images/background.webp";

export const Legal = () => {
  const { t } = useTranslation();
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(backgroundImage, "Legal");
    return () => setBackgroundImage(null, "Legal");
  }, [setBackgroundImage]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen">
      <Container className="px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 py-16 sm:py-20 md:py-28 lg:py-36 xl:py-44">
        <div className="mb-8 sm:mb-12 md:mb-16 text-center">
          <h1 className="font-nord text-4xl md:text-6xl font-bold text-white mb-6">
            {t("legal.title")}
          </h1>
          <p className="font-neue text-white/60 text-sm">
            {t("legal.lastUpdated")} : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24">
          <section className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 border border-white/10">
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.editor.title")}
            </h2>
            <div className="space-y-4 font-neue text-white/80">
              <p>
                <strong className="text-white">Nom :</strong>{" "}
                <span className="text-white/80">{t("legal.editor.name")}</span>
              </p>
              <p>
                <strong className="text-white">Statut :</strong>{" "}
                <span className="text-white/80">{t("legal.editor.status")}</span>
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
                <span className="text-white/80">{t("legal.editor.activity")}</span>
              </p>
              <p>
                <strong className="text-white">Code NAF :</strong>{" "}
                <span className="text-white/80">{t("legal.editor.nafCode")}</span>
              </p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 border border-white/10">
            <h2 className="font-nord text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
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
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.intellectual.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.intellectual.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.liability.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.liability.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.data.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.data.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.cookies.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.cookies.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.law.title")}
            </h2>
            <p className="font-neue text-white/80 leading-relaxed">
              {t("legal.law.content")}
            </p>
          </section>
        </div>

        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32 pt-8 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-20 border-t border-white/10">
          <p className="font-neue text-white/60 text-sm text-center">
            © {currentYear} Antoine Vernez - Tous droits réservés
          </p>
        </div>
      </Container>
    </div>
  );
};
