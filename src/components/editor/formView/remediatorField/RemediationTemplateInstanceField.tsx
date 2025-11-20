import {
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  MenuFooter,
  Button,
} from "@patternfly/react-core";
import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { useField, useFormikContext } from "formik";
import * as React from "react";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import { getFieldId } from "../../../../copiedFromConsole/formik-fields/field-utils";
import { getCreateInstanceUrl } from "../../../../data/model";
import { RemediationTemplate } from "../../../../data/types";

interface RemediationTemplateFieldProps {
  fieldName: string;
  kind: string;
  instances: RemediationTemplate[];
  loaded: boolean;
  error: unknown;
  autoSelectInstance: RemediationTemplate | undefined;
}

export const RemediationTemplateField: React.FC<
  RemediationTemplateFieldProps
> = ({ fieldName, kind, instances, loaded, error, autoSelectInstance }) => {
  const { t } = useNodeHealthCheckTranslation();
  const { setFieldValue } = useFormikContext();
  const nameFieldName = `${fieldName}.template.name`;
  const namespaceFieldName = `${fieldName}.template.namespace`;
  const apiVersionFieldName = `${fieldName}.template.apiVersion`;
  const [nameField] = useField<string>(nameFieldName);
  const [namespaceField] = useField<string>(namespaceFieldName);
  const [apiVersionField] = useField<string>(apiVersionFieldName);
  const [isOpen, setIsOpen] = React.useState(false);
  const fieldId = getFieldId(fieldName, "instance");
  const prevKindRef = React.useRef<string | undefined>(kind);

  // Get selected instance from name and namespace
  const selectedInstance = React.useMemo(() => {
    if (!nameField.value || !namespaceField.value) {
      return undefined;
    }
    return instances.find(
      (i) => i.name === nameField.value && i.namespace === namespaceField.value
    );
  }, [instances, nameField.value, namespaceField.value]);

  // Clear instance when kind changes (FR-010)
  React.useEffect(() => {
    if (prevKindRef.current !== undefined && prevKindRef.current !== kind) {
      setFieldValue(nameFieldName, "");
      setFieldValue(namespaceFieldName, "");
    }
    prevKindRef.current = kind;
  }, [kind, setFieldValue, nameFieldName, namespaceFieldName]);

  // Auto-select if exactly one instance
  React.useEffect(() => {
    if (autoSelectInstance && !nameField.value && !namespaceField.value) {
      setFieldValue(nameFieldName, autoSelectInstance.name);
      setFieldValue(namespaceFieldName, autoSelectInstance.namespace);
    }
  }, [
    autoSelectInstance,
    nameField.value,
    namespaceField.value,
    setFieldValue,
    nameFieldName,
    namespaceFieldName,
  ]);

  // Disable when: no kind, loading, or error
  const isDisabled = !kind || !loaded || !!error;

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const createInstanceUrl = React.useMemo(
    () => getCreateInstanceUrl(apiVersionField.value, kind),
    [apiVersionField.value, kind]
  );

  const onSelect = (_event: unknown, selection: string | number) => {
    const instance = instances.find(
      (i) => `${i.namespace}/${i.name}` === selection
    );
    if (instance) {
      setFieldValue(nameFieldName, instance.name);
      setFieldValue(namespaceFieldName, instance.namespace);
    }
    setIsOpen(false);
  };

  const onCreateNewInstanceClick = () => {
    if (createInstanceUrl) {
      window.open(createInstanceUrl, "_blank", "noopener,noreferrer");
    }
  };

  const placeholder = React.useMemo(() => {
    if (!kind) {
      return t("No selected Kind");
    }
    if (!loaded) {
      return t("Loading");
    }
    if (error) {
      return t("Error loading instances");
    }
    return "";
  }, [kind, loaded, error, t]);

  // Internal value format for selections prop (namespace/name)
  const selectedValue = selectedInstance
    ? `${selectedInstance.namespace}/${selectedInstance.name}`
    : undefined;

  return (
    <FormGroup fieldId={fieldId} label={t("Instance")} isRequired>
      <Select
        id={fieldId}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onOpenChangeKeys={["Escape"]}
        onSelect={onSelect}
        selections={selectedValue}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            onClick={onToggle}
            isExpanded={isOpen}
            isDisabled={isDisabled}
            isFullWidth
          >
            {selectedInstance ? selectedInstance.name : placeholder}
          </MenuToggle>
        )}
        maxMenuHeight="25rem"
        isScrollable
      >
        <SelectList>
          {instances.map((instance) => {
            const instanceValue = `${instance.namespace}/${instance.name}`;
            return (
              <SelectOption
                key={instanceValue}
                value={instanceValue}
                description={instance.namespace}
                isSelected={selectedValue === instanceValue}
              >
                {instance.name}
              </SelectOption>
            );
          })}
        </SelectList>
        {createInstanceUrl && loaded && (
          <MenuFooter>
            <Button
              variant="link"
              isInline
              onClick={onCreateNewInstanceClick}
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
            >
              {t("Create new instance")}
            </Button>
          </MenuFooter>
        )}
      </Select>
    </FormGroup>
  );
};
