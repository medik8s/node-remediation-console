import * as React from "react";
import { TextInput, TextInputTypes } from "@patternfly/react-core";
import BaseInputField from "./BaseInputField";
import { BaseInputFieldProps } from "./field-types";

const InputField = (
  { type = TextInputTypes.text, ...baseProps }: BaseInputFieldProps,
  ref
) => (
  <BaseInputField type={type} {...baseProps}>
    {(props) => <TextInput ref={ref} {...props} />}
  </BaseInputField>
);

export default React.forwardRef(InputField);
