import * as React from "react";
import { FormGroup, NumberInput } from "@patternfly/react-core";
import { useField } from "formik";
import toInteger from "lodash-es/toInteger";
import { FieldProps } from "../../copiedFromConsole/formik-fields/field-types";

type NumberSpinnerFieldProps = FieldProps & {
  min?: number;
  max?: number;
  onChange: () => void;
};

const NumberSpinnerField: React.FC<NumberSpinnerFieldProps> = ({
  label,
  labelIcon,
  helpText,
  required,
  onChange,
  ...props
}) => {
  const [field, { touched, error }, { setValue, setTouched }] = useField<
    number | undefined
  >(props.name);

  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : "";

  const changeValueBy = (operation: number) => {
    const newValue = toInteger(field.value) + operation;
    setValue(newValue);
    setTouched(true);
    onChange();
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
        {...field}
        {...props}
        id={props.name}
        value={field.value}
        onMinus={() => changeValueBy(-1)}
        onPlus={() => changeValueBy(1)}
        onChange={(event) => {
          const target = event.target as HTMLInputElement;
          setValue(target.value ? parseInt(target.value) : undefined);
          onChange();
        }}
        inputProps={{ ...props }}
        minusBtnAriaLabel="Decrement"
        plusBtnAriaLabel="Increment"
      />
    </FormGroup>
  );
};

export default NumberSpinnerField;
