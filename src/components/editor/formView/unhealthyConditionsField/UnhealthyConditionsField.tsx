import * as React from "react";
import {
  TextVariants,
  Text,
  TextContent,
  Form,
  Stack,
} from "@patternfly/react-core";
import { ArrayHelpers, FieldArray, useField } from "formik";
import {
  getArrayItemName,
  getObjectItemFieldName,
} from "components/shared/formik-utils";
import { FormViewFieldProps } from "../propTypes";
import {
  UnhealthyCondition as UnhealthyConditionItem,
  UnhealthyConditionStatus,
  UnhealtyConditionType,
} from "data/types";
import { WithRemoveButton } from "components/shared/WithRemoveButton";
import AddMoreButton from "components/shared/AddMoreButton";
import TypeSelectField from "./TypeField";
import "./unhealthyConditions.css";
import DurationField from "./DurationField";
import StatusField from "./StatusField";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { useFormikValidationFix } from "copiedFromConsole/hooks/formik-validation-fix";

const AddUnhealthyCondition: React.FC<{
  onPush: ArrayHelpers["push"];
}> = ({ onPush }) => {
  return (
    <AddMoreButton
      onClick={() =>
        onPush({
          duration: "",
          status: UnhealthyConditionStatus.False,
          type: "Ready",
        })
      }
      dataTest="add-unhealthy-condition"
    />
  );
};

const UnhealthyConditionItem: React.FC<{
  fieldName: string;
  onRemove: () => void;
  idx: number;
}> = ({ fieldName, idx }) => {
  const typeFieldName = getObjectItemFieldName([fieldName, "type"]);
  const [{ value: type }] = useField<UnhealtyConditionType>(typeFieldName);
  return (
    <Form data-test="unhealthy-condition" data-index={idx}>
      <TypeSelectField name={typeFieldName}></TypeSelectField>
      <StatusField
        name={getObjectItemFieldName([fieldName, "status"])}
        type={type}
      ></StatusField>
      <DurationField
        name={`${getObjectItemFieldName([fieldName, "duration"])}`}
      ></DurationField>
    </Form>
  );
};

export const UnhealthyConditionArray: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const [{ value }] = useField<UnhealthyConditionItem[]>(fieldName);
  useFormikValidationFix(value ? value.length : value);
  if (!value) {
    return null;
  }
  return (
    <FieldArray
      name={fieldName}
      validateOnChange={false}
      render={({ push, remove }) => (
        <Stack hasGutter>
          {value.map((currentValue, idx) => {
            return (
              <Stack>
                <WithRemoveButton
                  onClick={() => remove(idx)}
                  isDisabled={value.length === 1}
                  key={idx}
                  dataTest="remove-unhealthy-condition"
                >
                  {null}
                </WithRemoveButton>
                <UnhealthyConditionItem
                  key={getArrayItemName(fieldName, idx)}
                  fieldName={getArrayItemName(fieldName, idx)}
                  onRemove={() => remove(idx)}
                  idx={idx}
                />
              </Stack>
            );
          })}

          <AddUnhealthyCondition onPush={push} />
        </Stack>
      )}
    ></FieldArray>
  );
};

const UnhealthyConditionsField = ({ fieldName }: FormViewFieldProps) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <Stack>
      <TextContent>
        <Text component={TextVariants.h3}>Unhealthy conditions</Text>
        <Text component={TextVariants.small}>
          {t(
            "Nodes that meet any of these conditions for a certain amount of time will be remediated."
          )}
        </Text>
      </TextContent>

      <UnhealthyConditionArray fieldName={fieldName} />
    </Stack>
  );
};

export default UnhealthyConditionsField;
