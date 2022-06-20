import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
} from "@patternfly/react-core";
import { getFieldId } from "components/copiedFromConsole/formik-fields/field-utils";
import { LoadingInline } from "components/copiedFromConsole/status-box";
import AddMoreButton from "components/shared/AddMoreButton";
import { WithRemoveButton } from "components/shared/WithRemoveButton";
import * as React from "react";
import * as _ from "lodash";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { NodeHealthCheck } from "data/types";
import { editNodeHealthCheckPauseReasons } from "apis/nodeHealthCheckApis";

type PauseReasonFieldProps = {
  onRemove(idx: number): void;
  onAdd(): void;
  onEdit(idx: number, value: string): void;
  pauseReasons: string[];
};

const PauseReasonsField: React.FC<PauseReasonFieldProps> = ({
  onRemove,
  onAdd,
  onEdit,
  pauseReasons,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <Form>
      {pauseReasons.map((value, idx) => {
        return (
          <FormGroup
            fieldId={getFieldId("pause-reason", "input")}
            isRequired
            label={t("Pause reason")}
            key={idx}
            helperText={t(
              "Describe the reason for pausing this NodeHealthCheck remediation."
            )}
          >
            <WithRemoveButton
              onClick={() => onRemove(idx)}
              isDisabled={pauseReasons.length === 1 && !pauseReasons[0]}
              key={idx}
            >
              <TextInput
                name={`pause-reason-${idx}`}
                value={pauseReasons[idx]}
                onChange={(value) => onEdit(idx, value)}
              />
            </WithRemoveButton>
          </FormGroup>
        );
      })}

      <AddMoreButton
        onClick={() => {
          onAdd();
        }}
      />
    </Form>
  );
};

type PauseReasonsModalProps = {
  failureErrorMessage: string;
  title: string;
  confirmButtonText: string;
  nodeHealthCheck: NodeHealthCheck;
  onClose(): void;
  isOpen: boolean;
  initialPauseReasons: string[];
};

const EditPauseReasonsModal: React.FC<PauseReasonsModalProps> = ({
  failureErrorMessage,
  title,
  confirmButtonText,
  nodeHealthCheck,
  onClose,
  isOpen,
  initialPauseReasons,
}) => {
  const [pauseReasons, setPauseReasons] =
    React.useState<string[]>(initialPauseReasons);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>();
  const [error, setError] = React.useState<boolean>();
  const { t } = useNodeHealthCheckTranslation();
  const onConfirm = async () => {
    setIsSubmitting(true);
    try {
      await editNodeHealthCheckPauseReasons(nodeHealthCheck, pauseReasons);
    } catch (err) {
      setError(err);
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    onClose();
  };

  const onAdd: PauseReasonFieldProps["onAdd"] = () => {
    const newPauseReasons = _.clone(pauseReasons);
    newPauseReasons.push("");
    setPauseReasons(newPauseReasons);
  };

  const onRemove: PauseReasonFieldProps["onRemove"] = (idx: number) => {
    let newPauseReasons = _.clone(pauseReasons);
    if (pauseReasons.length === 1) {
      newPauseReasons[0] = "";
    } else {
      newPauseReasons.splice(idx, 1);
    }
    setPauseReasons(newPauseReasons);
  };

  const onEdit: PauseReasonFieldProps["onEdit"] = (
    idx: number,
    value: string
  ) => {
    const newPauseReasons = _.clone(pauseReasons);
    newPauseReasons[idx] = value;
    setPauseReasons(newPauseReasons);
  };

  const hasEmptyValue = (): boolean => {
    return pauseReasons.filter((pauseReason) => !pauseReason).length > 0;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.small}
      title={title}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          onClick={onConfirm}
          isDisabled={hasEmptyValue()}
        >
          {confirmButtonText}
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          {t("Cancel")}
        </Button>,
      ]}
    >
      <PauseReasonsField {...{ onAdd, onRemove, pauseReasons, onEdit }} />
      {isSubmitting && <LoadingInline />}
      {error && <Alert variant="danger" title={failureErrorMessage} />}
    </Modal>
  );
};

export default EditPauseReasonsModal;
