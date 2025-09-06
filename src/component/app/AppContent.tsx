import { ModalProvider } from "../../contexts/ModalContext";
import { LenisProvider } from "../../contexts/LenisProvider";
import { AppRouter } from "./AppRouter";

export const AppContent = () => {
  return (
    <ModalProvider>
      <LenisProvider
        options={{ lerp: 0.04, duration: 1.2, wheelMultiplier: 0.5 }}
      >
        <AppRouter />
      </LenisProvider>
    </ModalProvider>
  );
};
