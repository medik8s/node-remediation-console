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
import { Flex, FlexItem } from "@patternfly/react-core";
const sentenceCase = (string: string) => {
  return capitalize(startCase(string));
};

const CustomRemediatorField = ({ fieldName }: FormViewFieldProps) => {
  const [{ value }] = useField<Remediator>(fieldName);
  return (
    <Flex
      direction={{ default: "column" }}
      spaceItems={{ default: "spaceItemsSm" }}
    >
      {["apiVersion", "kind", "name", "namespace"].map((subFieldName) => {
        const inputFieldName = getObjectItemFieldName([
          fieldName,
          "template",
          subFieldName,
        ]);
        return (
          <FlexItem key={inputFieldName}>
            <InputField
              required
              name={inputFieldName}
              label={sentenceCase(subFieldName)}
              isDisabled={value?.radioOption === RemediatorRadioOption.SNR}
            />
          </FlexItem>
        );
      })}
    </Flex>
  );
};

export const RemediatorField: React.FC<{
  fieldName: string;
  snrTemplate: RemediationTemplate | undefined;
}> = ({ fieldName, snrTemplate }) => {
  const [value] = useField<Remediator>(fieldName);
  useFormikValidationFix(value);
  return (
    <Flex
      direction={{ default: "column" }}
      spaceItems={{ default: "spaceItemsSm" }}
    >
      <FlexItem>
        <RemediatorKindField fieldName={fieldName} snrTemplate={snrTemplate} />
      </FlexItem>
      <FlexItem>
        <CustomRemediatorField fieldName={fieldName} />
      </FlexItem>
    </Flex>
  );
};

export default RemediatorField;
