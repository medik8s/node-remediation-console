import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalBoxFooter,
  ModalVariant,
  TextInput,
} from "@patternfly/react-core";
import * as React from "react";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { useField } from "formik";

type CustomTypeModalProps = {
  onClose(): void;
  isOpen: boolean;
  fieldName: string;
};

const CustomTypeModal: React.FC<CustomTypeModalProps> = ({
  fieldName,
  isOpen,
  onClose,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [, , { setValue }] = useField(fieldName);
  const [customType, setCustomType] = React.useState<string>("");
  React.useEffect(() => {
    if (!isOpen) {
      setCustomType("");
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      variant={ModalVariant.small}
      title={t("Use custom type")}
      data-test="use-custom-type-modal"
      actions={[]}
    >
      <Form>
        <FormGroup
          fieldId="custom-type"
          isRequired
          label={t("Type")}
          helperText={t("Name of the custom type")}
        >
          <TextInput
            name={fieldName}
            value={customType}
            onChange={(value) => setCustomType(value)}
            data-test="custom-type-input"
            aria-label="custom type"
          />
        </FormGroup>
        <ModalBoxFooter>
          <Button
            key="confirm"
            variant="primary"
            onClick={() => {
              setValue(customType);
              onClose();
            }}
            isDisabled={!customType}
            data-test="confirm-custom-type"
            type="submit"
          >
            {t("Create")}
          </Button>
          <Button
            key="cancel"
            variant="link"
            onClick={onClose}
            data-test="cancel-custom-type"
          >
            {t("Cancel")}
          </Button>
          ,
        </ModalBoxFooter>
      </Form>
    </Modal>
  );
};

export default CustomTypeModal;
