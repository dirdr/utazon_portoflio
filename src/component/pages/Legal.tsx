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
    <div className="min-h-screen my-8 lg:my-32 pb-16 lg:pb-24">
      <Container variant="constrained" maxWidth="4xl">
        <div className="mb-8 sm:mb-12 md:mb-16 text-center">
          <h1 className="PageTitle mb-1">
            {t("legal.title")}
          </h1>
          <p className="paragraph mb-8">
            {t("legal.lastUpdated")} : {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="SectionTitle mb-6">
              {t("legal.editor.title")}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="SectionTitle">Nom</h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.name")}
                </p>
              </div>
              <div>
                <h3 className="SectionTitle">
                  Statut
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.status")}
                </p>
              </div>
              <div>
                <h3 className="SectionTitle">
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
                <h3 className="SectionTitle">
                  Téléphone
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.phone")}
                </p>
              </div>
              <div>
                <h3 className="SectionTitle">
                  Code SIRET
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.siret")}
                </p>
              </div>
              <div>
                <h3 className="SectionTitle">
                  Activité
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.activity")}
                </p>
              </div>
              <div>
                <h3 className="SectionTitle">
                  Code NAF
                </h3>
                <p className="font-neue text-gray text-base">
                  {t("legal.editor.nafCode")}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="SectionTitle mb-6">
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
            <h2 className="SectionTitle mb-6">
              {t("legal.intellectual.title")}
            </h2>
            <p className="paragraph">
              {t("legal.intellectual.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="SectionTitle mb-6">
              {t("legal.liability.title")}
            </h2>
            <p className="paragraph">
              {t("legal.liability.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="SectionTitle mb-6">
              {t("legal.data.title")}
            </h2>
            <p className="paragraph">
              {t("legal.data.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="SectionTitle mb-6">
              {t("legal.cookies.title")}
            </h2>
            <p className="paragraph">
              {t("legal.cookies.content")}
            </p>
          </section>

          <section className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="SectionTitle mb-6">
              {t("legal.law.title")}
            </h2>
            <p className="paragraph">
              {t("legal.law.content")}
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
};
