import { useTranslation } from "react-i18next";
import { Container } from "../layout/Container";
import { useBackgroundStore } from "../../hooks/useBackgroundStore";
import { useEffect } from "react";

const LEGAL_BG = "/src/assets/images/background.webp";

export const Legal = () => {
  const { t } = useTranslation();
  const setBackgroundImage = useBackgroundStore(
    (state) => state.setBackgroundImage,
  );

  useEffect(() => {
    setBackgroundImage(LEGAL_BG);
    return () => setBackgroundImage(null);
  }, [setBackgroundImage]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen">
      <Container className="py-16 md:py-24">
        <div className="mb-16">
          <h1 className="font-nord text-4xl md:text-6xl font-bold text-white mb-6">
            {t("legal.title")}
          </h1>
          <p className="font-neue text-white/60 text-sm">
            {t("legal.lastUpdated")} : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.editor.title")}
            </h2>
            <div className="space-y-3 font-neue text-white/80">
              <p>
                <strong className="text-white">{t("legal.editor.name")}</strong>
              </p>
              <p>{t("legal.editor.status")}</p>
              <p>{t("legal.editor.address")}</p>
              <p>
                <strong className="text-white">Email :</strong>{" "}
                <a
                  href="mailto:contact@utazon.com"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {t("legal.editor.email")}
                </a>
              </p>
              <p>{t("legal.editor.phone")}</p>
              <p className="text-white/60 text-sm italic">
                {t("legal.editor.siret")}
              </p>
              <p>{t("legal.editor.activity")}</p>
              <p>{t("legal.editor.nafCode")}</p>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="font-nord text-2xl font-bold text-white mb-6">
              {t("legal.hosting.title")}
            </h2>
            <div className="space-y-3 font-neue text-white/80">
              <p className="text-white/60 italic">
                {t("legal.hosting.provider")}
              </p>
              <p className="text-white/60 italic">
                {t("legal.hosting.address")}
              </p>
              <p className="text-white/60 italic">{t("legal.hosting.phone")}</p>
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

        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="font-neue text-white/60 text-sm text-center">
            © {currentYear} Antoine Vernez - Tous droits réservés
          </p>
        </div>
      </Container>
    </div>
  );
};

