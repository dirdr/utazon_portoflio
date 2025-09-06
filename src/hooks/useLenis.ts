import { useContext } from "react";
import { LenisContext } from "../contexts/LenisContext";

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenis must be used within LenisProvider");
  }
  return context;
};

