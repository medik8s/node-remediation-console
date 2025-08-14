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
  onChange,
  ...props
}) => {
  const [field] = useField(props.name);
  const fieldId = getFieldId(props.name, "radiogroup");

  return (
    <FormGroup fieldId={fieldId} className="nhc-form-synced-editor-field">
      <Flex alignContent={{ default: "alignContentCenter" }}>
        <FlexItem>
          <label className="pf-v5-c-form__label" id={fieldId}>
            <span className="pf-v5-c-form__label-text">{label}</span>
          </label>
        </FlexItem>
        {options.map((option) => {
          return (
            <FlexItem key={option.value}>
              <RadioButtonField
                {...field}
                {...props}
                value={option.value}
                label={option.label}
                isDisabled={option.isDisabled}
                aria-describedby={helpText ? `${fieldId}-helper` : undefined}
                onChange={onChange}
              />
            </FlexItem>
          );
        })}
      </Flex>
    </FormGroup>
  );
};

export default RadioGroupField;
