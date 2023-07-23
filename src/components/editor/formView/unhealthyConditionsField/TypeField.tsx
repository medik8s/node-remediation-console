import * as React from "react";
import CustomTypeModal from "./CustomTypeModal";
import DropdownField, {
  DropdownFieldProps,
} from "components/shared/DropdownField";
import { UnhealthyConditionFieldProps } from "./propTypes";
import { DropdownItem, DropdownSeparator } from "@patternfly/react-core";
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

  const dropdownItems: DropdownFieldProps["items"] = getOptions(t);
  dropdownItems.push(<DropdownSeparator key="type-field-separator" />);
  dropdownItems.push(
    <DropdownItem
      key="use-custom-type"
      onClick={() => setCustomTypeModalOpen(true)}
    >
      Use custom type
    </DropdownItem>
  );
  return (
    <>
      <DropdownField
        name={name}
        label={"Type"}
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
