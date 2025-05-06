import * as React from "react";
import {
  FormGroup,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from "@patternfly/react-core";
import { useField } from "formik";
import { getFieldId } from "../../copiedFromConsole/formik-fields/field-utils";

export type SelectItem = {
  label: string;
  value: string;
};

const isReactElement = (
  item: SelectItem | React.ReactElement
): item is React.ReactElement => {
  return "props" in item;
};

export type SelectFieldProps = {
  name: string;
  label?: string;
  isRequired?: boolean;
  items: (SelectItem | React.ReactElement)[];
  isDisabled?: boolean;
};

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  isRequired = false,
  items,
  isDisabled = false,
}) => {
  const [{ value }, , { setValue }] = useField(name);
  const [isOpen, setIsOpen] = React.useState(false);
  const fieldId = getFieldId(name, "dropdown");

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (e, value) => {
    setIsOpen(false);
    setValue(value);
  };

  const getSelectItems = () => {
    return items.map((item, idx) => {
      if (isReactElement(item)) {
        return item;
      }
      return (
        <SelectOption
          key={idx}
          data-test={`select-${item.label}`}
          value={item.value}
        >
          {item.label}
        </SelectOption>
      );
    });
  };

  const getToggleLabel = () => {
    const selectItem = items.find(
      (item) => !isReactElement(item) && item.value === value
    ) as SelectItem;
    if (selectItem) {
      return selectItem.label;
    }
    return value;
  };

  return (
    <FormGroup fieldId={fieldId} label={label} isRequired={isRequired}>
      <Select
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            data-test={`toggle-${label}-select`}
            onClick={onToggle}
            isDisabled={isDisabled}
            isExpanded={isOpen}
            style={{
              width: "200px",
            }}
          >
            {getToggleLabel()}
          </MenuToggle>
        )}
        onOpenChange={setIsOpen}
        onSelect={onSelect}
        isOpen={isOpen}
        readOnly={isDisabled}
      >
        <SelectList>{getSelectItems()}</SelectList>
      </Select>
    </FormGroup>
  );
};

export default SelectField;
