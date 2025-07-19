import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="font-nord text-lg hover:text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm"
      aria-label={`Switch to ${i18n.language === "fr" ? "English" : "Français"}`}
    >
      {i18n.language === "fr" ? "FR" : "EN"}
    </button>
  );
};
