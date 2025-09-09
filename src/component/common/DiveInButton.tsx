import { motion } from "framer-motion";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";
import { OverlayManager } from "./OverlayManager";
import { OVERLAY_Z_INDEX } from "../../constants/overlayZIndex";

interface DiveInButtonProps {
  onDiveIn: () => void;
  isReady?: boolean;
  className?: string;
}

export const DiveInButton = ({
  onDiveIn,
  isReady = true,
  className = "",
}: DiveInButtonProps) => {
  const { t } = useTranslation();

  const handleClick = () => {
    if (isReady) {
      onDiveIn();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <OverlayManager>
      <motion.div
        className={`fixed inset-0 flex items-center justify-center complex-animation ${className}`}
        style={{ zIndex: OVERLAY_Z_INDEX.DIVE_IN_BUTTON_CONTAINER }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 1, 0.5, 1],
          scale: { type: "spring", stiffness: 260, damping: 20 },
        }}
        role="dialog"
        aria-label="Welcome screen"
      >
        <motion.div
          whileHover={{
            scale: 1.12,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
              mass: 0.8,
            },
          }}
          whileTap={{
            scale: 0.95,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.1,
            },
          }}
          whileFocus={{
            scale: 1.05,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}
          className="cursor-pointer focus:outline-none relative smooth-animation"
          style={{
            zIndex: OVERLAY_Z_INDEX.DIVE_IN_BUTTON_ELEMENT,
            contentVisibility: "auto",
          }}
          tabIndex={isReady ? 0 : -1}
          onKeyDown={handleKeyDown}
          role="button"
          aria-label={t("home.diveIn", "Dive In")}
          aria-disabled={!isReady}
        >
          <Button
            as="button"
            onClick={handleClick}
            glint={true}
            proximityIntensity={true}
            speed={3}
            className={`text-xs md:text-sm lg:text-base 2xl:text-lg font-nord tracking-widest uppercase transition-all duration-300 ${
              isReady ? "opacity-100 cursor-pointer" : "opacity-50 cursor-wait"
            }`}
            disabled={!isReady}
          >
            {t("home.diveIn", "Dive In")}
          </Button>
        </motion.div>
      </motion.div>
    </OverlayManager>
  );
};
