import * as React from "react";
import {
  Divider,
  Flex,
  FlexItem,
  FormGroup,
  FormSection,
} from "@patternfly/react-core";
import { ArrayHelpers, FieldArray, useField } from "formik";
import {
  getArrayItemName,
  getObjectItemFieldName,
} from "components/shared/formik-utils";
import { FormViewFieldProps } from "../propTypes";
import {
  UnhealthyCondition,
  UnhealthyConditionStatus,
  UnhealtyConditionType,
} from "data/types";
import { WithRemoveButton } from "components/shared/WithRemoveButton";
import TypeSelectField from "./TypeField";
import DurationField from "./DurationField";
import StatusField from "./StatusField";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { useFormikValidationFix } from "copiedFromConsole/hooks/formik-validation-fix";
import AddMoreButton from "components/shared/AddMoreButton";

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
}> = ({ fieldName }) => {
  const typeFieldName = getObjectItemFieldName([fieldName, "type"]);
  const [{ value: type }] = useField<UnhealtyConditionType>(typeFieldName);
  return (
    <>
      <FlexItem>
        <TypeSelectField name={typeFieldName} />
      </FlexItem>
      <FlexItem>
        <StatusField
          name={getObjectItemFieldName([fieldName, "status"])}
          type={type}
        />
      </FlexItem>
      <FlexItem>
        <DurationField
          name={`${getObjectItemFieldName([fieldName, "duration"])}`}
        />
      </FlexItem>
    </>
  );
};

export const UnhealthyConditionArray: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const [{ value }] = useField<UnhealthyCondition[]>(fieldName);
  useFormikValidationFix(value ? value.length : value);
  if (!value) {
    return null;
  }
  return (
    <FieldArray
      name={fieldName}
      validateOnChange={false}
      render={({ push, remove }) => (
        <Flex
          direction={{ default: "column" }}
          spaceItems={{ default: "spaceItemsSm" }}
        >
          <FlexItem>
            {value.map((currentValue, idx) => {
              return (
                <Flex
                  key={idx}
                  direction={{ default: "column" }}
                  spaceItems={{ default: "spaceItemsSm" }}
                >
                  <WithRemoveButton
                    onClick={() => remove(idx)}
                    isDisabled={value.length === 1}
                    dataTest="remove-unhealthy-condition"
                  />
                  <UnhealthyConditionItem
                    key={getArrayItemName(fieldName, idx)}
                    fieldName={getArrayItemName(fieldName, idx)}
                    onRemove={() => remove(idx)}
                    idx={idx}
                  />
                  <FlexItem>
                    <Divider />
                  </FlexItem>
                </Flex>
              );
            })}
          </FlexItem>
          <FlexItem>
            <AddUnhealthyCondition onPush={push} />
          </FlexItem>
        </Flex>
      )}
    />
  );
};

const UnhealthyConditionsField = ({ fieldName }: FormViewFieldProps) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <FormSection title={t("Unhealthy conditions")} titleElement="h2">
      <FormGroup>
        <UnhealthyConditionArray fieldName={fieldName} />
      </FormGroup>
    </FormSection>
  );
};

export default UnhealthyConditionsField;
