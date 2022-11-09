import HelpIcon from "components/shared/HelpIcon";
import InputField from "copiedFromConsole/formik-fields/InputField";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

import * as React from "react";
import { UnhealthyConditionFieldProps } from "./propTypes";

const DurationField: React.FC<UnhealthyConditionFieldProps> = ({ name }) => {
  const { t } = useNodeHealthCheckTranslation();

  const icon = (
    <HelpIcon
      helpText={t(
        "Specifies the timeout duration for a node condition. If a condition is met for the duration of the timeout, the node remediation will occur."
      )}
    />
  );
  return (
    <InputField
      name={name}
      label={t("Duration")}
      labelIcon={icon}
      helpText={t(
        `Expects a string of decimal numbers each with optional fraction and a unit suffix, eg "300ms", "1.5h" or "2h45m". Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".`
      )}
      required
      data-test="duration-input"
    ></InputField>
  );
};

export default DurationField;
