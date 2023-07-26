import * as React from "react";

import { FormViewFieldProps } from "../propTypes";

import RemediatorKindField from "./RemediatorKindField";
import { useField } from "formik";
import { capitalize, startCase } from "lodash-es";
import { getObjectItemFieldName } from "../../../shared/formik-utils";
import InputField from "../../../../copiedFromConsole/formik-fields/InputField";
import { useFormikValidationFix } from "../../../../copiedFromConsole/hooks/formik-validation-fix";
import {
  RemediationTemplate,
  Remediator,
  RemediatorRadioOption,
} from "../../../../data/types";
import { Stack, StackItem } from "@patternfly/react-core";
const sentenceCase = (string: string) => {
  return capitalize(startCase(string));
};

const CustomRemediatorField = ({ fieldName }: FormViewFieldProps) => {
  const [{ value }] = useField<Remediator>(fieldName);
  return (
    <Stack hasGutter>
      {["apiVersion", "kind", "name", "namespace"].map((subFieldName) => {
        const inputFieldName = getObjectItemFieldName([
          fieldName,
          "template",
          subFieldName,
        ]);
        return (
          <StackItem key={inputFieldName}>
            <InputField
              required
              name={inputFieldName}
              label={sentenceCase(subFieldName)}
              isDisabled={value?.radioOption === RemediatorRadioOption.SNR}
            />
          </StackItem>
        );
      })}
    </Stack>
  );
};

export const RemediatorField: React.FC<{
  fieldName: string;
  snrTemplate: RemediationTemplate | undefined;
}> = ({ fieldName, snrTemplate }) => {
  const [value] = useField<Remediator>(fieldName);
  useFormikValidationFix(value);
  return (
    <Stack hasGutter>
      <StackItem>
        <RemediatorKindField fieldName={fieldName} snrTemplate={snrTemplate} />
      </StackItem>
      <StackItem>
        <CustomRemediatorField fieldName={fieldName} />
      </StackItem>
    </Stack>
  );
};

export default RemediatorField;
