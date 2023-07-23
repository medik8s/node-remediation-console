import * as React from "react";
import DeleteModal from "./DeleteModal";
import EditPauseModal from "./EditPauseModal";
import { useModals } from "./ModalsContext";
import PauseModal from "./PauseModal";
import { UnpauseModal } from "./UnpauseModal";
import "./modals.css";
import { LabelsModal } from "copiedFromConsole/LabelsModal/LabelsModal";
import {
  updateNodeHealthCheckAnnotations,
  updateNodeHealthCheckLabels,
} from "apis/nodeHealthCheckApis";
import { AnnotationsModal } from "copiedFromConsole/AnnotationsModal/AnnotationsModal";

export enum ModalId {
  PAUSE = "pause",
  UNPAUSE = "unpause",
  EDIT_PAUSE = "edit_pause",
  DELETE = "delete",
  EDIT_LABELS = "edit_labels",
  EDIT_ANNOTATIONS = "edit_annotations",
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
          onClose={() => modalsContext.closeModal()}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.EDIT_PAUSE) && (
        <EditPauseModal
          isOpen={modalsContext.isOpen(ModalId.EDIT_PAUSE)}
          onClose={() => modalsContext.closeModal()}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.UNPAUSE) && (
        <UnpauseModal
          isOpen={modalsContext.isOpen(ModalId.UNPAUSE)}
          onClose={() => modalsContext.closeModal()}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
        />
      )}
      {modalsContext.isOpen(ModalId.DELETE) && (
        <DeleteModal
          isOpen={modalsContext.isOpen(ModalId.DELETE)}
          onClose={() => modalsContext.closeModal()}
          nodeHealthCheck={modalsContext.getNodeHealthCheck()}
          onDelete={onDelete}
        />
      )}
      {modalsContext.isOpen(ModalId.EDIT_LABELS) && (
        <LabelsModal
          isOpen={modalsContext.isOpen(ModalId.EDIT_LABELS)}
          onClose={() => modalsContext.closeModal()}
          obj={modalsContext.getNodeHealthCheck()}
          onLabelsSubmit={(labels) =>
            updateNodeHealthCheckLabels(
              modalsContext.getNodeHealthCheck(),
              labels
            )
          }
        />
      )}
      {modalsContext.isOpen(ModalId.EDIT_ANNOTATIONS) && (
        <AnnotationsModal
          isOpen={modalsContext.isOpen(ModalId.EDIT_ANNOTATIONS)}
          onClose={() => modalsContext.closeModal()}
          obj={modalsContext.getNodeHealthCheck()}
          onSubmit={(annotations) =>
            updateNodeHealthCheckAnnotations(
              modalsContext.getNodeHealthCheck(),
              annotations
            )
          }
        />
      )}
    </>
  );
};

export default Modals;
