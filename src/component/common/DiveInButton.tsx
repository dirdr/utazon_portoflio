import { Button } from "./Button";
import { useTranslation } from "react-i18next";

interface DiveInButtonProps {
  onDiveIn: () => void;
  className?: string;
}

export const DiveInButton = ({ onDiveIn, className = "" }: DiveInButtonProps) => {
  const { t } = useTranslation();

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black ${className}`}>
      <Button 
        as="button"
        onClick={onDiveIn}
        glint={true}
        className="text-6xl px-20 py-12 font-nord font-bold tracking-widest uppercase"
        style={{
          fontSize: '4rem',
          letterSpacing: '0.2em',
          minWidth: '400px',
          minHeight: '120px',
        }}
      >
        {t("home.diveIn", "Dive In")}
      </Button>
    </div>
  );
};