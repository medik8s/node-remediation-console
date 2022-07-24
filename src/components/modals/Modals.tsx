import * as React from "react";
import DeleteModal from "./DeleteModal";
import EditPauseModal from "./EditPauseModal";
import { useModals } from "./ModalsContext";
import PauseModal from "./PauseModal";
import { UnpauseModal } from "./UnpauseModal";
import "./modals.css";

export enum ModalId {
  PAUSE = "pause",
  UNPAUSE = "unpause",
  EDIT_PAUSE = "edit_pause",
  DELETE = "delete",
}

const Modals: React.FC<{ onDelete?: () => void }> = ({ onDelete }) => {
  const modalsContext = useModals();
  if (!modalsContext.getNodeHealthCheck()) {
    return null;
  }

  return (
    <>
      {modalsContext.isOpen(ModalId.PAUSE) && (
        <PauseModal
          isOpen={modalsContext.isOpen(ModalId.PAUSE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.EDIT_PAUSE) && (
        <EditPauseModal
          isOpen={modalsContext.isOpen(ModalId.EDIT_PAUSE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.UNPAUSE) && (
        <UnpauseModal
          isOpen={modalsContext.isOpen(ModalId.UNPAUSE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.DELETE) && (
        <DeleteModal
          isOpen={modalsContext.isOpen(ModalId.DELETE)}
          onClose={modalsContext.closeModal}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default Modals;
