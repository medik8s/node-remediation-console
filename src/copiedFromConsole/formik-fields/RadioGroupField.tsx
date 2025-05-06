import * as React from "react";
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import { useField } from "formik";
import { RadioGroupFieldProps } from "./field-types";
import { getFieldId } from "./field-utils";
import RadioButtonField from "./RadioButtonField";
import * as classNames from "classnames";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  label,
  options,
  helpText,
  required,
  isInline,
  onChange,
  ...props
}) => {
  const [field, { touched, error }] = useField(props.name);
  const fieldId = getFieldId(props.name, "radiogroup");
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : "";

  const validated = isValid ? "default" : "error";
  return (
    <FormGroup
      fieldId={fieldId}
      isRequired={required}
      label={label}
      isInline={isInline}
      className={classNames("ocs-radio-group-field", {
        "ocs-radio-group-field--inline": isInline,
      })}
    >
      <Split hasGutter>
        {options.map((option) => {
          const activeChild =
            field.value === option.value && option.activeChildren;
          const staticChild = option.children;

          const description = (activeChild || staticChild) && (
            <div className="ocs-radio-group-field__children">
              {staticChild}
              {activeChild}
            </div>
          );

          return (
            <SplitItem key={option.value}>
              <RadioButtonField
                {...field}
                {...props}
                value={option.value}
                label={option.label}
                isDisabled={option.isDisabled}
                aria-describedby={helpText ? `${fieldId}-helper` : undefined}
                description={description}
                onChange={onChange}
              />
            </SplitItem>
          );
        })}
      </Split>
      <FormHelperText>
        <HelperText>
          <HelperTextItem
            variant={validated}
            {...(validated === "error" && {
              icon: <ExclamationCircleIcon />,
            })}
          >
            {validated === "error" ? errorMessage : helpText}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default RadioGroupField;
