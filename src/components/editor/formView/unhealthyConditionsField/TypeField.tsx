import * as React from "react";
import CustomTypeModal from "./CustomTypeModal";
import DropdownField from "components/shared/DropdownField";
import { UnhealthyConditionFieldProps } from "./propTypes";
import { useField } from "formik";
import { DropdownItem, DropdownSeparator } from "@patternfly/react-core";

const TypeOptions = [
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

  const [, , { setValue }] = useField(name);
  const dropdownItems = TypeOptions.map((option, idx) => (
    <DropdownItem key={idx} onClick={() => setValue(option.value)}>
      {option.label}
    </DropdownItem>
  ));

  dropdownItems.push(<DropdownSeparator key="type-field-separator" />);
  dropdownItems.push(
    <DropdownItem
      key="use-custom-type"
      onClick={() => setCustomTypeModalOpen(true)}
    >
      Use Custom Type
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
