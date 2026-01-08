import * as React from "react";
import { Flex, FlexItem, FormGroup } from "@patternfly/react-core";
import { useField } from "formik";
import { RadioGroupFieldProps } from "./field-types";
import { getFieldId } from "./field-utils";
import RadioButtonField from "./RadioButtonField";

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  label,
  options,
  helpText,
  required,
  isInline,
  labelPosition = "inline",
  onChange,
  className,
  ...props
}) => {
  const [field] = useField(props.name);
  const fieldId = getFieldId(props.name, "radiogroup");

  const radioButtons = options.map((option) => (
    <RadioButtonField
      key={option.value}
      {...field}
      {...props}
      value={option.value}
      label={option.label}
      isDisabled={option.isDisabled}
      aria-describedby={helpText ? `${fieldId}-helper` : undefined}
      onChange={onChange}
    />
  ));

  if (labelPosition === "stacked") {
    // Standard PatternFly layout: label on top, radio buttons inline below
    return (
      <FormGroup
        fieldId={fieldId}
        label={label}
        isRequired={required}
        className={className}
      >
        <Flex>
          {radioButtons.map((radioButton, index) => (
            <FlexItem key={options[index].value}>{radioButton}</FlexItem>
          ))}
        </Flex>
      </FormGroup>
    );
  }

  // Inline layout: label on left, radio buttons inline on right (for synced editor)
  return (
    <FormGroup fieldId={fieldId} className={className}>
      <Flex alignContent={{ default: "alignContentCenter" }}>
        <FlexItem>
          <label className="pf-v5-c-form__label" id={fieldId}>
            <span className="pf-v5-c-form__label-text">{label}</span>
          </label>
        </FlexItem>
        {radioButtons.map((radioButton, index) => (
          <FlexItem key={options[index].value}>{radioButton}</FlexItem>
        ))}
      </Flex>
    </FormGroup>
  );
};

export default RadioGroupField;
