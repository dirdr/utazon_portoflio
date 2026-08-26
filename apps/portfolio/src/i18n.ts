import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Cache busting: use build time to invalidate Cloudflare Pages cache
// This changes on every build, forcing fresh translations
const CACHE_VERSION = import.meta.env.VITE_BUILD_TIME || Date.now();

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    backend: {
      loadPath: `/locales/{{lng}}/{{ns}}.json?v=${CACHE_VERSION}`,
      requestOptions: {
        cache: "no-store",
      },
    },
  });

export default i18n;
