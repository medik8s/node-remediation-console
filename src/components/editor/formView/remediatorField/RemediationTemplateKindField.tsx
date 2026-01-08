import * as React from "react";
import {
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Divider,
  HelperTextItem,
  HelperText,
  FormHelperText,
} from "@patternfly/react-core";
import { useField, useFormikContext } from "formik";
import { getFieldId } from "../../../../copiedFromConsole/formik-fields/field-utils";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import {
  PREDEFINED_REMEDIATION_TEMPLATE_KINDS,
  getKindInfo,
} from "../../../../data/remediationTemplateKinds";
import { getApiVersion } from "../../../../data/model";
import CustomKindModal from "./CustomKindModal";

interface RemediationTemplateKindFieldProps {
  fieldName: string;
}

const USE_CUSTOM_KIND = "use-custom-kind";

export const RemediationTemplateKindField: React.FC<
  RemediationTemplateKindFieldProps
> = ({ fieldName }) => {
  const { t } = useNodeHealthCheckTranslation();
  const { setFieldValue } = useFormikContext();
  const kindFieldName = `${fieldName}.template.kind`;
  const apiVersionFieldName = `${fieldName}.template.apiVersion`;
  const [field, , { setValue }] = useField<string>(kindFieldName);
  const [isOpen, setIsOpen] = React.useState(false);
  const [customKindModalOpen, setCustomKindModalOpen] =
    React.useState<boolean>(false);
  const fieldId = getFieldId(fieldName, "kind");

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    if (value === USE_CUSTOM_KIND) {
      // Don't set the value, just open the modal
      setCustomKindModalOpen(true);
      setIsOpen(false);
    } else if (value && value !== USE_CUSTOM_KIND) {
      const kind = String(value);
      setValue(kind);
      // Set apiVersion for predefined kinds
      const kindInfo = getKindInfo(kind);
      if (kindInfo) {
        setFieldValue(
          apiVersionFieldName,
          getApiVersion(kindInfo.groupVersionKind)
        );
      }
      setIsOpen(false);
    }
  };

  return (
    <>
      <FormGroup fieldId={fieldId} label={t("Kind")} isRequired>
        <Select
          id={fieldId}
          isOpen={isOpen}
          selected={field.value}
          onSelect={onSelect}
          onOpenChange={setIsOpen}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={onToggle}
              isExpanded={isOpen}
              isFullWidth
            >
              {field.value || ""}
            </MenuToggle>
          )}
          maxMenuHeight="25rem"
          isScrollable
        >
          <SelectList id={`${fieldId}-listbox`}>
            {PREDEFINED_REMEDIATION_TEMPLATE_KINDS.map((kind) => {
              const kindInfo = getKindInfo(kind);
              const apiVersion = kindInfo
                ? getApiVersion(kindInfo.groupVersionKind)
                : undefined;
              return (
                <SelectOption key={kind} value={kind} description={apiVersion}>
                  {kind}
                </SelectOption>
              );
            })}
            <Divider key="kind-field-separator" component="li" />
            <SelectOption key={USE_CUSTOM_KIND} value={USE_CUSTOM_KIND}>
              {t("Use custom kind")}
            </SelectOption>
          </SelectList>
        </Select>
        <FormHelperText>
          <HelperText>
            <HelperTextItem>
              {t(
                "Choose from officially supported remediation templates, or use a custom kind."
              )}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      </FormGroup>
      {customKindModalOpen && (
        <CustomKindModal
          fieldName={`${fieldName}.template`}
          onClose={() => setCustomKindModalOpen(false)}
        />
      )}
    </>
  );
};
