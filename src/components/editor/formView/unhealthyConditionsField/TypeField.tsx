import * as React from "react";
import CustomTypeModal from "./CustomTypeModal";
import SelectField, { SelectFieldProps } from "components/shared/SelectField";
import { UnhealthyConditionFieldProps } from "./propTypes";
import { Divider, SelectOption } from "@patternfly/react-core";
import { TFunction } from "i18next";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

const getOptions = (t: TFunction) => [
  {
    label: t("Ready"),
    value: "Ready",
  },
  {
    label: t("Disk pressure"),
    value: "DiskPressure",
  },
  {
    label: t("Memory pressure"),
    value: "MemoryPressure",
  },
  {
    label: t("PID pressure"),
    value: "PIDPressure",
  },
  {
    label: t("Network unavailable"),
    value: "NetworkUnavailable",
  },
];

const TypeSelectField: React.FC<UnhealthyConditionFieldProps> = ({ name }) => {
  const { t } = useNodeHealthCheckTranslation();
  const [customTypeModalOpen, setCustomTypeModalOpen] =
    React.useState<boolean>(false);

  const dropdownItems: SelectFieldProps["items"] = getOptions(t);
  dropdownItems.push(<Divider key="type-field-separator" component="li" />);
  dropdownItems.push(
    <SelectOption
      key="use-custom-type"
      onClick={() => setCustomTypeModalOpen(true)}
    >
      {t("Use custom type")}
    </SelectOption>
  );
  return (
    <>
      <SelectField
        name={name}
        label={t("Type")}
        isRequired
        items={dropdownItems}
      />
      <CustomTypeModal
        fieldName={name}
        onClose={() => setCustomTypeModalOpen(false)}
        isOpen={customTypeModalOpen}
      />
    </>
  );
};

export default TypeSelectField;
