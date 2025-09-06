import { ModalProvider } from "../../contexts/ModalContext";
import { LenisProvider } from "../../contexts/LenisProvider";
import { AppRouter } from "./AppRouter";

export const AppContent = () => {
  return (
    <ModalProvider>
      <LenisProvider
        options={{
          lerp: 0.1,
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 0.8,
          touchMultiplier: 1,
        }}
      >
        <AppRouter />
      </LenisProvider>
    </ModalProvider>
  );
};
