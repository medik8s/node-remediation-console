import * as React from "react";
import { FormGroup, FormSection } from "@patternfly/react-core";
import { useField } from "formik";
import RadioGroupField from "../../../../copiedFromConsole/formik-fields/RadioGroupField";
import InputField from "../../../../copiedFromConsole/formik-fields/InputField";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import { getObjectItemFieldName } from "../../../shared/formik-utils";
import { FieldProps } from "../../../../copiedFromConsole/formik-fields/field-types";
import { FormViewFieldProps } from "../propTypes";
import HelpIcon from "../../../../components/shared/HelpIcon";

type HealthThresholdModeFieldProps = FieldProps;

const HealthThresholdModeField: React.FC<HealthThresholdModeFieldProps> = ({
  name,
  ...props
}) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <RadioGroupField
      name={name}
      label={t("Threshold Mode")}
      labelPosition="stacked"
      options={[
        { label: t("Min healthy"), value: "minHealthy" },
        { label: t("Max unhealthy"), value: "maxUnhealthy" },
      ]}
      isInline
      {...props}
    />
  );
};

const HealthThresholdValueField: React.FC<
  FormViewFieldProps & { modeFieldName: string }
> = ({ fieldName, modeFieldName }) => {
  const { t } = useNodeHealthCheckTranslation();
  const [{ value: mode }] = useField<"minHealthy" | "maxUnhealthy">(
    modeFieldName
  );

  const helpText =
    mode === "maxUnhealthy"
      ? t(
          `Remediation is allowed if no more than "MaxUnhealthy" nodes selected by "selector" are not healthy. 
0% is valid and will block all remediation. MaxUnhealthy should not be used with remediators that delete nodes (e.g. MachineDeletionRemediation), 
as this breaks the logic for counting healthy and unhealthy nodes.`
        )
      : t(
          `Remediation is allowed if at least "MinHealthy" nodes selected by "selector" are healthy. 
100% is valid and will block all remediation.`
        );

  return (
    <InputField
      required
      label={t("Threshold value")}
      name={fieldName}
      data-test="threshold-value"
      labelIcon={<HelpIcon helpText={helpText} />}
      helpText={t(
        "Enter a percentage or a positive integer. For example: 25 or 70%."
      )}
    />
  );
};

type HealthThresholdSectionProps = {
  fieldNamePrefix: string;
};

const HealthThresholdSection: React.FC<HealthThresholdSectionProps> = ({
  fieldNamePrefix,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const modeFieldName = getObjectItemFieldName([
    fieldNamePrefix,
    "healthThresholdMode",
  ]);
  return (
    <FormSection title={t("Health Threshold")} titleElement="h2">
      <FormGroup>
        <HealthThresholdModeField name={modeFieldName} />
        <HealthThresholdValueField
          fieldName={getObjectItemFieldName([
            fieldNamePrefix,
            "healthThresholdValue",
          ])}
          modeFieldName={modeFieldName}
        />
      </FormGroup>
    </FormSection>
  );
};

export default HealthThresholdSection;
