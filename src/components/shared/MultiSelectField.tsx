/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as React from "react";
import { useField } from "formik";
import {
  FormGroup,
  Select,
  SelectProps,
  SelectVariant,
} from "@patternfly/react-core";

import fuzzy from "fuzzysearch";
import { getFieldId } from "../../copiedFromConsole/formik-fields/field-utils";
import { FieldProps } from "../../copiedFromConsole/formik-fields/field-types";
export interface MultiSelectFieldProps extends FieldProps {
  options: JSX.Element[];
  placeholderText?: string;
  onChange?: (val: string[]) => void;
  getHelperText?: (value: string) => React.ReactNode | undefined;
  enableClear: boolean;
  isLoading: boolean;
  isRequired: boolean;
}

// Field value is a string[]
const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  label,
  options,
  helpText,
  getHelperText,
  onChange,
  labelIcon,
  enableClear,
  isLoading,
  isRequired,
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
    const selectionValue = selection;
    let newValue;
    if (selected.includes(selectionValue)) {
      newValue = selected.filter((sel: string) => sel !== selectionValue);
    } else {
      newValue = [...field.value, selectionValue];
    }
    setValue(newValue);
  };

  const onFilter = (_, textInput) => {
    if (textInput === "") {
      return options;
    } else {
      const filteredGroups = options
        .map((group) => {
          const filteredGroup = React.cloneElement(group, {
            children: group.props.children.filter((item) => {
              return fuzzy(textInput, item.props.value);
            }),
          });
          if (filteredGroup.props.children.length > 0) return filteredGroup;
        })
        .filter((newGroup) => newGroup);
      return filteredGroups;
    }
  };

  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      helperText={hText}
      helperTextInvalid={errorMessage}
      validated={isValid ? "default" : "error"}
      isRequired={isRequired}
      labelIcon={labelIcon}
      data-test={`multi-select-${label}`}
    >
      <Select
        {...field}
        {...props}
        id={fieldId}
        variant={SelectVariant.checkbox}
        typeAheadAriaLabel="Select a label"
        validated={isValid ? "default" : "error"}
        aria-describedby={`${fieldId}-helper`}
        isCreatable={false}
        placeholderText="Filter by label"
        isOpen={isOpen}
        onToggle={onToggle}
        onSelect={onSelect}
        selections={field.value}
        onClear={enableClear ? onClearSelection : null}
        loadingVariant={isLoading ? "spinner" : undefined}
        isGrouped
        hasInlineFilter
        onFilter={onFilter}
        maxHeight={400}
      >
        {options}
      </Select>
    </FormGroup>
  );
};

export default MultiSelectField;
