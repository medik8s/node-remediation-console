import * as React from "react";
import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
} from "@patternfly/react-core";
import { useField } from "formik";
import { BaseInputFieldProps } from "./field-types";
import { useFormikValidationFix } from "../hooks/formik-validation-fix";
import { getFieldId } from "./field-utils";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

const BaseInputField: React.FC<
  BaseInputFieldProps & {
    helperIconText?: string;
    children: (props) => React.ReactNode;
  }
> = ({
  label,
  labelIcon,
  helpText,
  required,
  children,
  name,
  onChange,
  onBlur,
  helpTextInvalid,
  validated,
  ...props
}) => {
  const [field, { touched, error }] = useField({ name, type: "input" });
  const fieldId = getFieldId(name, "input");
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : "";
  useFormikValidationFix(field.value);

  const isValidated = !isValid ? "error" : validated ?? "default";
  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      isRequired={required}
      labelHelp={labelIcon}
    >
      {children({
        ...field,
        ...props,
        value: field.value || "",
        id: fieldId,
        label,
        validated: isValidated,
        "aria-describedby": helpText ? `${fieldId}-helper` : undefined,
        onChange: (event, value) => {
          field.onChange(event);
          onChange && onChange(event);
        },
        onBlur: (event) => {
          field.onBlur(event);
          onBlur && onBlur(event);
        },
      })}
      <FormHelperText>
        <HelperText>
          <HelperTextItem
            variant={isValidated}
            {...(isValidated === "error" && {
              icon: <ExclamationCircleIcon />,
            })}
          >
            {isValidated === "error"
              ? errorMessage || helpTextInvalid
              : helpText}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

export default BaseInputField;
