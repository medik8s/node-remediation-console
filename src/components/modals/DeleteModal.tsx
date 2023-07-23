import {
  Alert,
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { deleteNodeHealthCheck } from "apis/nodeHealthCheckApis";
import * as React from "react";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { NodeHealthCheckModalProps } from "./propTypes";

const DeleteModal: React.FC<
  NodeHealthCheckModalProps & { onDelete: () => void }
> = ({ isOpen, nodeHealthCheck, onClose, onDelete }) => {
  const [error, setError] = React.useState<boolean>();
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const { t } = useNodeHealthCheckTranslation();
  if (!isOpen) {
    return null;
  }
  const onClickDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNodeHealthCheck(nodeHealthCheck);
      setIsDeleting(false);
      onClose();
      if (onDelete) {
        onDelete();
      }
    } catch (err) {
      setIsDeleting(false);
      setError(err);
    }
  };
  const name = nodeHealthCheck.metadata?.name;
  return (
    <Modal
      className="nhc-modal"
      title={t("Delete NodeHealthCheck")}
      titleIconVariant="warning"
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.small}
      actions={[
        <Button
          aria-label="delete"
          key="confirm"
          variant={ButtonVariant.danger}
          onClick={onClickDelete}
          isLoading={isDeleting}
          data-test="confirm"
        >
          {t("Delete")}
        </Button>,
        <Button
          key="cancel"
          variant={ButtonVariant.link}
          onClick={onClose}
          aria-label="cancel"
        >
          {t("Cancel")}
        </Button>,
      ]}
    >
      {t("Are you sure you want to delete {{name}}?", { name })}
      {error && (
        <Alert
          variant="danger"
          title={t("Failed to delete {{name}}", { name })}
          isInline
        />
      )}
    </Modal>
  );
};

export default DeleteModal;
