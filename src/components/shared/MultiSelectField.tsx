import * as React from "react";
import { useField } from "formik";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectProps,
  SelectVariant,
} from "@patternfly/react-core";
import { getFieldId } from "copiedFromConsole/formik-fields/field-utils";
import { FieldProps } from "copiedFromConsole/formik-fields/field-types";
import * as fuzzy from "fuzzysearch";
export interface MultiSelectFieldProps extends FieldProps {
  options: string[];
  placeholderText?: string;
  onChange?: (val: string[]) => void;
  getHelperText?: (value: string) => React.ReactNode | undefined;
  enableClear: boolean;
  isLoading: boolean;
}

// Field value is a string[]
const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  helpText,
  placeholderText,
  getHelperText,
  required,
  onChange,
  labelIcon,
  enableClear,
  isLoading,
  ...props
}) => {
  const [isOpen, setOpen] = React.useState(false);
  const [field, { touched, error }, { setValue }] = useField(props.name);
  const fieldId = getFieldId(props.name, "multiinput");
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : "";
  const hText = getHelperText ? getHelperText(field.value) : helpText;

  const onToggle = (isOpen: boolean) => setOpen(isOpen);
  const onClearSelection = () => {
    // onChange && onChange(event);
    setValue([]);
    onChange && onChange([]);
    setOpen(false);
  };

  const onSelect: SelectProps["onSelect"] = (event, selection) => {
    // already selected
    const selected = field.value;
    let selectionValue = selection;
    let newValue;
    if (selected.includes(selectionValue)) {
      newValue = selected.filter((sel: string) => sel !== selectionValue);
    } else {
      newValue = [...field.value, selectionValue];
    }
    setValue(newValue);
  };

  const children = options
    .filter((option) => !(field.value || []).includes(option))
    .map((option) => (
      <SelectOption key={option} id={option} value={option} isDisabled={false}>
        {option}
      </SelectOption>
    ));

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      helperText={hText}
      helperTextInvalid={errorMessage}
      validated={isValid ? "default" : "error"}
      isRequired={required}
      labelIcon={labelIcon}
      data-test={`multi-select-${label}`}
    >
      <Select
        {...field}
        {...props}
        id={fieldId}
        variant={SelectVariant.typeaheadMulti}
        typeAheadAriaLabel="Select a label"
        validated={isValid ? "default" : "error"}
        aria-describedby={`${fieldId}-helper`}
        isCreatable={false}
        placeholderText={placeholderText}
        isOpen={isOpen}
        onToggle={onToggle}
        onSelect={onSelect}
        selections={field.value}
        onClear={enableClear ? onClearSelection : null}
        loadingVariant={isLoading ? "spinner" : undefined}
        onFilter={(e, val) => {
          if (!val || val === "") {
            return children;
          }
          return children.filter((child) => fuzzy(val, child.props.value));
        }}
      >
        {children}
      </Select>
    </FormGroup>
  );
};

export default MultiSelectField;
