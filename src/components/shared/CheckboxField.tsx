import * as React from "react";
import {
  Checkbox,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { useField } from "formik";
import { FieldProps } from "../../copiedFromConsole/formik-fields/field-types";
import { omit } from "lodash-es";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

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

  const validated = isValid ? "default" : "error";

  return (
    <FormGroup
      fieldId={name}
      label={formLabel}
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
          onChange: (event, val) => {
            field.onChange(event);
            onChange && onChange(val);
          },
        }}
      />
      <FormHelperText>
        <HelperText>
          <HelperTextItem
            variant={validated}
            {...(validated === "error" && { icon: <ExclamationCircleIcon /> })}
          >
            {errorMessage || helpText}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default CheckboxField;
