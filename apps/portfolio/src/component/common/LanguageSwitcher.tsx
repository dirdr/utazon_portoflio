import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChange);

    setCurrentLang(i18n.language);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  const toggleLanguage = () => {
    const normalizedLang = currentLang.startsWith("en") ? "en" : "fr";
    const newLang = normalizedLang === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  const normalizedLang = currentLang.startsWith("en") ? "en" : "fr";
  const displayLang = normalizedLang.toUpperCase();

  return (
    <button
      onClick={toggleLanguage}
      className="font-nord ButtonText hover:text-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm cursor-pointer"
      aria-label={`Switch to ${normalizedLang === "fr" ? "English" : "Français"}`}
    >
      {displayLang}
    </button>
  );
};
