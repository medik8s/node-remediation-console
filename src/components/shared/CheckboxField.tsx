import * as React from "react";
import { Checkbox, FormGroup } from "@patternfly/react-core";
import { useField } from "formik";
import { FieldProps } from "../../copiedFromConsole/formik-fields/field-types";
import { omit } from "lodash-es";

export type CheckboxFieldProps = FieldProps & {
  formLabel?: string;
  value?: string;
  onChange?: (val: boolean) => void;
};

const CheckboxField = ({
  label,
  formLabel,
  helpText,
  required,
  onChange,
  name,
  labelIcon,
  ...props
}: CheckboxFieldProps) => {
  const [field, { touched, error }] = useField<boolean>(name);
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : "";

  return (
    <FormGroup
      fieldId={name}
      label={formLabel}
      helperText={helpText}
      helperTextInvalid={errorMessage}
      validated={isValid ? "default" : "error"}
      isRequired={required}
      labelIcon={labelIcon}
    >
      <Checkbox
        {...{
          ...omit(field, ["value"]),
          ...props,
          checked: field.value,
          id: name,
          label,
          isChecked: field.value,
          isValid,
          "aria-describedby": helpText ? `${name}-helper` : undefined,
          onChange: (val, event) => {
            field.onChange(event);
            onChange && onChange(val);
          },
        }}
      />
    </FormGroup>
  );
};

export default CheckboxField;
