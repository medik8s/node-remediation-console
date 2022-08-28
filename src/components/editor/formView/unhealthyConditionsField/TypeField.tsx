import * as React from "react";
import CustomTypeModal from "./CustomTypeModal";
import DropdownField, {
  DropdownFieldProps,
} from "components/shared/DropdownField";
import { UnhealthyConditionFieldProps } from "./propTypes";
import { DropdownItem, DropdownSeparator } from "@patternfly/react-core";

const getOptions = () => [
  {
    label: "Ready",
    value: "Ready",
  },
  {
    label: "Disk pressure",
    value: "DiskPressure",
  },
  {
    label: "Memory pressure",
    value: "MemoryPressure",
  },
  {
    label: "PID pressure",
    value: "PIDPressure",
  },
  {
    label: "Network unavailable",
    value: "NetworkUnavailable",
  },
];

const TypeSelectField: React.FC<UnhealthyConditionFieldProps> = ({ name }) => {
  const [customTypeModalOpen, setCustomTypeModalOpen] =
    React.useState<boolean>(false);

  const dropdownItems: DropdownFieldProps["items"] = getOptions();
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
      ></DropdownField>
      <CustomTypeModal
        fieldName={name}
        onClose={() => setCustomTypeModalOpen(false)}
        isOpen={customTypeModalOpen}
      />
    </>
  );
};

export default TypeSelectField;
