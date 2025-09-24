import { ModalProvider } from "../../contexts/ModalContext";
import { CanvasReadinessProvider } from "../../contexts/CanvasReadinessProvider";
import { AppRouter } from "./AppRouter";

export const AppContent = () => {
  return (
    <CanvasReadinessProvider>
      <ModalProvider>
        <AppRouter />
      </ModalProvider>
    </CanvasReadinessProvider>
  );
};
