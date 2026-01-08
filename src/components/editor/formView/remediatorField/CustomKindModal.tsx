import {
  Alert,
  Button,
  Form,
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Modal,
  ModalVariant,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
import * as React from "react";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { useField, useFormikContext } from "formik";
import { useRemediationTemplateCRDs } from "../../../../apis/useRemediationTemplateCRDs";

type CustomKindModalProps = {
  onClose(): void;
  fieldName: string;
};

type CustomKindModalContentProps = {
  selectedCRD: string | undefined;
  onCRDSelect: (value: string | undefined) => void;
  crds: ReturnType<typeof useRemediationTemplateCRDs>[0];
  crdsLoaded: ReturnType<typeof useRemediationTemplateCRDs>[1];
  crdsError: ReturnType<typeof useRemediationTemplateCRDs>[2];
};

const CustomKindModalContent: React.FC<CustomKindModalContentProps> = ({
  selectedCRD,
  onCRDSelect,
  crds,
  crdsLoaded,
  crdsError,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const [isCRDSelectOpen, setIsCRDSelectOpen] = React.useState(false);

  const getCRDToggleLabel = () => {
    if (!crdsLoaded) {
      return t("Loading");
    }
    if (selectedCRD) {
      return selectedCRD;
    }
    return t("Select a Kind");
  };

  if (crdsError) {
    return (
      <Form>
        <FormGroup>
          <Alert variant="danger" title={t("Error loading CRDs")} isInline>
            {t("Could not load CustomResourceDefinitions.")}
          </Alert>
        </FormGroup>
      </Form>
    );
  }

  return (
    <Form>
      {crds.length === 0 && crdsLoaded && (
        <FormGroup>
          <Alert variant="warning" title={t("No CRDs available")} isInline>
            {t(
              "No CustomResourceDefinitions with remediation template structure (spec.template.spec) were found in the cluster besides the predefined supported ones. Please select from predefined remediation template kinds or install remediation template operators to use custom kinds."
            )}
          </Alert>
        </FormGroup>
      )}
      <FormGroup fieldId="crd-select" label={t("Kind")} isRequired>
        <Select
          id="crd-select"
          isOpen={isCRDSelectOpen}
          selected={selectedCRD}
          onSelect={(
            _event: React.MouseEvent<Element, MouseEvent> | undefined,
            value: string | number | undefined
          ) => {
            if (value && typeof value === "string") {
              onCRDSelect(value);
            }
            setIsCRDSelectOpen(false);
          }}
          onOpenChange={setIsCRDSelectOpen}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setIsCRDSelectOpen(!isCRDSelectOpen)}
              isExpanded={isCRDSelectOpen}
              isFullWidth
              isDisabled={!crdsLoaded || crds.length === 0}
            >
              {crds.length === 0 && crdsLoaded
                ? t("No CRDs available")
                : getCRDToggleLabel()}
            </MenuToggle>
          )}
          maxMenuHeight="25rem"
          isScrollable
        >
          <SelectList>
            {crds.map((crd) => (
              <SelectOption
                key={crd.kind}
                value={crd.kind}
                description={crd.apiVersion}
              >
                {crd.kind}
              </SelectOption>
            ))}
          </SelectList>
        </Select>
      </FormGroup>
    </Form>
  );
};

const CustomKindModal: React.FC<CustomKindModalProps> = ({
  fieldName,
  onClose,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const { setFieldValue } = useFormikContext();
  const kindFieldName = `${fieldName}.kind`;
  const apiVersionFieldName = `${fieldName}.apiVersion`;
  const [, , { setValue }] = useField(kindFieldName);
  const [selectedCRD, setSelectedCRD] = React.useState<string | undefined>(
    undefined
  );
  const [crds, crdsLoaded, crdsError] = useRemediationTemplateCRDs();

  const selectedCRDObj = React.useMemo(() => {
    if (!selectedCRD) return undefined;
    return crds.find((crd) => crd.kind === selectedCRD);
  }, [selectedCRD, crds]);

  const handleConfirm = () => {
    if (selectedCRDObj) {
      // Set both kind and apiVersion when CRD is selected
      setValue(selectedCRDObj.kind);
      setFieldValue(apiVersionFieldName, selectedCRDObj.apiVersion);
    }
    onClose();
  };

  const canProceed =
    crdsLoaded && !crdsError && crds.length > 0 && selectedCRD !== undefined;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      variant={ModalVariant.small}
      title={t("Use custom kind")}
      description={t(
        "Select from CustomResourceDefinitions that have the spec.template.spec field structure and are not the officially supported remediation template kinds."
      )}
      data-test="use-custom-kind-modal"
      actions={[
        <Button
          key="confirm"
          variant="primary"
          onClick={handleConfirm}
          isDisabled={!canProceed}
          data-test="confirm-custom-kind"
          type="submit"
        >
          {t("OK")}
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={onClose}
          data-test="cancel-custom-kind"
        >
          {t("Cancel")}
        </Button>,
      ]}
    >
      <CustomKindModalContent
        selectedCRD={selectedCRD}
        onCRDSelect={setSelectedCRD}
        crds={crds}
        crdsLoaded={crdsLoaded}
        crdsError={crdsError}
      />
    </Modal>
  );
};

export default CustomKindModal;
