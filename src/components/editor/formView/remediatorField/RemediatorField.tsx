import * as React from "react";

import { FormViewFieldProps } from "../propTypes";

import RemediatorKindField from "./RemediatorKindField";
import { useField } from "formik";
import { capitalize, startCase } from "lodash-es";
import { getObjectItemFieldName } from "../../../shared/formik-utils";
import InputField from "../../../../copiedFromConsole/formik-fields/InputField";
import { useFormikValidationFix } from "../../../../copiedFromConsole/hooks/formik-validation-fix";
import { Remediator, SnrTemplateResult } from "../../../../data/types";
const sentenceCase = (string: string) => {
  return capitalize(startCase(string));
};

const CustomRemediatorField = ({ fieldName }: FormViewFieldProps) => (
  <>
    {["apiVersion", "kind", "name", "namespace"].map((subFieldName) => {
      const inputFieldName = getObjectItemFieldName([fieldName, subFieldName]);
      return (
        <InputField
          required
          name={inputFieldName}
          key={inputFieldName}
          label={sentenceCase(subFieldName)}
        />
      );
    })}
  </>
);

export const RemediatorField: React.FC<{
  fieldName: string;
  snrTemplateResult: SnrTemplateResult;
}> = ({ fieldName, snrTemplateResult }) => {
  const [value] = useField<Remediator>(fieldName);
  useFormikValidationFix(value);
  return (
    <>
      <RemediatorKindField
        fieldName={fieldName}
        snrTemplateResult={snrTemplateResult}
      />
      <CustomRemediatorField fieldName={`${fieldName}.template`} />
    </>
  );
};

export default RemediatorField;
