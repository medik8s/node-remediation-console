import { NodeHealthCheck } from "data/types";
import * as React from "react";
import { ModalId } from "./Modals";

export type ModalsContextApi = {
  openModal(modalId: ModalId, nodeHealthCheck: NodeHealthCheck): void;
  closeModal(): void;
  isOpen(modalId: ModalId): boolean;
  getNodeHealthCheck(): NodeHealthCheck;
};

const ModalsContext = React.createContext<ModalsContextApi>(null);

export const ModalsContextProvider: React.FC = ({ children }) => {
  const [openModalId, setOpenModalId] = React.useState<ModalId>();
  const [nodeHealthCheck, setNodeHealthCheck] =
    React.useState<NodeHealthCheck>();
  const modalsApi = React.useMemo<ModalsContextApi>(() => {
    return {
      openModal: (modalId: ModalId, nodeHealthCheck: NodeHealthCheck) => {
        setNodeHealthCheck(nodeHealthCheck);
        setOpenModalId(modalId);
      },
      closeModal: () => {
        setOpenModalId(undefined);
        setNodeHealthCheck(undefined);
      },
      isOpen: (modalId) => {
        return openModalId === modalId;
      },
      getNodeHealthCheck: () => nodeHealthCheck,
    };
  }, [openModalId, setOpenModalId]);
  return (
    <ModalsContext.Provider value={modalsApi}>
      {children}
    </ModalsContext.Provider>
  );
};

export const useModals = () => {
  const context = React.useContext(ModalsContext);
  if (!context) {
    throw new Error("useModals must be used within ModalsContextProvider.");
  }
  return context;
};
