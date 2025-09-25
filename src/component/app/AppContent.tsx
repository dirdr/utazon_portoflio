import { ModalProvider } from "../../contexts/ModalContext";
import { AppRouter } from "./AppRouter";

export const AppContent = () => {
  return (
    <ModalProvider>
      <AppRouter />
    </ModalProvider>
  );
};
