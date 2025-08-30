import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import logo from "../../assets/images/logo.svg";

export const GlobalLoader = () => {
  // Note: Scroll blocking removed - only home page should be non-scrollable

  const { t } = useTranslation();

  return (
    <motion.div
      className="h-screen w-screen flex items-center justify-center bg-black text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      role="dialog"
      aria-labelledby="loader-title"
      aria-live="polite"
    >
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 font-nord h-full px-4">
        <div className="flex items-center gap-4 flex-shrink-0">
          <motion.a
            href="/"
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          >
            <img src={logo} alt="Utazon Logo" className="h-12 w-auto" />
          </motion.a>

          <div className="flex flex-col items-start">
            <div className="overflow-hidden">
              <motion.a
                href="/"
                className="text-2xl text-white block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1],
                  delay: 0.2,
                }}
              >
                {t("common.utazon")}
              </motion.a>
            </div>
            <div className="overflow-hidden">
              <motion.span
                className="text-muted text-base block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 1, 0.5, 1],
                  delay: 0.4,
                }}
              >
                {t("common.antoine_vernez")}
              </motion.span>
            </div>
          </div>
        </div>

        <motion.div
          className="relative w-52 h-0.5 bg-gray-600 overflow-hidden"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.6 }}
        >
          <motion.div
            className="absolute top-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-white to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
