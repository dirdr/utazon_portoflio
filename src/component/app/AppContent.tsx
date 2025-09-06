import { ModalProvider } from "../../contexts/ModalContext";
import { LenisProvider } from "../../contexts/LenisContext";
import { AppRouter } from "./AppRouter";

export const AppContent = () => {
  return (
    <ModalProvider>
      <LenisProvider options={{ lerp: 0.05, duration: 1.2, wheelMultiplier: 0.8 }}>
        <AppRouter />
      </LenisProvider>
    </ModalProvider>
  );
};
