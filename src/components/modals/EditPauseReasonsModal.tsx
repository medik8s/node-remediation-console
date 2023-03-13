import {
  Alert,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBoxFooter,
  ModalVariant,
  TextInput,
} from "@patternfly/react-core";
import { getFieldId } from "copiedFromConsole/formik-fields/field-utils";
import * as React from "react";

import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { NodeHealthCheck } from "data/types";
import { editNodeHealthCheckPauseReasons } from "apis/nodeHealthCheckApis";
import { WithRemoveButton } from "components/shared/WithRemoveButton";
import AddMoreButton from "components/shared/AddMoreButton";
import { clone } from "lodash-es";

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
    <>
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
            data-index={idx}
            data-test="pause-reason-field"
          >
            <WithRemoveButton
              onClick={() => onRemove(idx)}
              isDisabled={pauseReasons.length === 1 && !pauseReasons[0]}
              key={idx}
              dataTest="remove-pause-reason"
            >
              <TextInput
                name={`pause-reason-${idx}`}
                value={pauseReasons[idx]}
                onChange={(value) => onEdit(idx, value)}
                data-test="pause-reason-input"
                data-index={idx}
                aria-label="pause reason"
              />
            </WithRemoveButton>
          </FormGroup>
        );
      })}

      <AddMoreButton
        onClick={() => {
          onAdd();
        }}
        dataTest="add-pause-reason"
      />
    </>
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

  const onSubmit = async () => {
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
    const newPauseReasons = clone(pauseReasons);
    newPauseReasons.push("");
    setPauseReasons(newPauseReasons);
  };

  const onRemove: PauseReasonFieldProps["onRemove"] = (idx: number) => {
    let newPauseReasons = clone(pauseReasons);
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
    const newPauseReasons = clone(pauseReasons);
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
      className="nhc-modal"
    >
      <Form>
        <PauseReasonsField {...{ onAdd, onRemove, pauseReasons, onEdit }} />
        {error && (
          <Alert variant="danger" title={failureErrorMessage} isInline />
        )}
        <ModalBoxFooter>
          <Button
            key="confirm"
            variant="primary"
            onClick={onSubmit}
            isDisabled={hasEmptyValue() || isSubmitting}
            isLoading={isSubmitting}
            data-test="confirm"
            type="submit"
          >
            {confirmButtonText}
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={onClose}
            data-test="cancel"
          >
            {t("Cancel")}
          </Button>
        </ModalBoxFooter>
      </Form>
    </Modal>
  );
};

export default EditPauseReasonsModal;
