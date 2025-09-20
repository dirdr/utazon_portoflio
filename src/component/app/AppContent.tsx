import { ModalProvider } from "../../contexts/ModalContext";
import { LenisProvider } from "../../contexts/LenisProvider";
import { CanvasReadinessProvider } from "../../contexts/CanvasReadinessProvider";
import { AppRouter } from "./AppRouter";

export const AppContent = () => {
  return (
    <CanvasReadinessProvider>
      <ModalProvider>
        <LenisProvider
          options={{
            lerp: 0.1,
            duration: 1,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1,
          }}
        >
          <AppRouter />
        </LenisProvider>
      </ModalProvider>
    </CanvasReadinessProvider>
  );
};
