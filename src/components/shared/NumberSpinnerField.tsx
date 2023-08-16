import * as React from "react";
import { FormGroup, NumberInput } from "@patternfly/react-core";
import { useField } from "formik";
import toInteger from "lodash-es/toInteger";
import { FieldProps } from "../../copiedFromConsole/formik-fields/field-types";

type NumberSpinnerFieldProps = FieldProps & {
  min?: number;
  max?: number;
  onChange?: () => void;
  onBlur?: () => void;
};

const NumberSpinnerField: React.FC<NumberSpinnerFieldProps> = ({
  label,
  labelIcon,
  helpText,
  required,
  onChange,
  onBlur,
  ...props
}) => {
  const [field, { touched, error }, { setValue, setTouched }] = useField<
    number | ""
  >(props.name);

  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : "";

  const changeValueBy = (operation: number) => {
    const newValue = toInteger(field.value) + operation;
    setValue(newValue);
    setTouched(true);
    if (onChange) {
      onChange();
    }
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <FormGroup
      fieldId={props.name}
      label={label}
      helperText={helpText}
      helperTextInvalid={errorMessage}
      validated={isValid ? "default" : "error"}
      isRequired={required}
      labelIcon={labelIcon}
    >
      <NumberInput
        name={props.name}
        id={props.name}
        value={field.value}
        onMinus={() => changeValueBy(-1)}
        onPlus={() => changeValueBy(1)}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setValue(target.value === "" ? target.value : +target.value);
          if (onChange) {
            onChange();
          }
        }}
        onBlur={(event) => {
          field.onBlur(event);
          if (onBlur) {
            onBlur();
          }
        }}
        minusBtnAriaLabel="Decrement"
        plusBtnAriaLabel="Increment"
        allowEmptyInput
      />
    </FormGroup>
  );
};

export default NumberSpinnerField;
