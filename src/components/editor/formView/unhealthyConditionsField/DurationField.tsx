import HelpIcon from "components/shared/HelpIcon";
import InputField from "copiedFromConsole/formik-fields/InputField";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

import * as React from "react";
import { getDurationHelptext } from "../../../../copiedFromConsole/utils/durationUtils";
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
      helpText={getDurationHelptext(t)}
      required
      data-test="duration-input"
    />
  );
};

export default DurationField;
