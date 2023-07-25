import { FormGroup } from "@patternfly/react-core";
import { useFormikContext } from "formik";
import * as React from "react";
import {
  NodeHealthCheckFormValues,
  SnrTemplateResult,
} from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import RemediatorField from "./RemediatorField";
import RemediatorsArrayField from "./RemediatorsArrayField";
import UseEscalatingCheckboxField from "./UseEcalatingCheckboxField";

const RemediationTemplateField = ({
  snrTemplateResult,
}: {
  snrTemplateResult: SnrTemplateResult;
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const { values } = useFormikContext<NodeHealthCheckFormValues>();
  return (
    <FormGroup title={t("Remediation template")} fieldId="remediation-template">
      <UseEscalatingCheckboxField />
      {!values.formData.useEscalating && (
        <RemediatorField
          fieldName={"formData.remediator"}
          snrTemplateResult={snrTemplateResult}
        />
      )}
      {values.formData.useEscalating && (
        <RemediatorsArrayField snrTemplateResult={snrTemplateResult} />
      )}
    </FormGroup>
  );
};

export default RemediationTemplateField;
