import { FormGroup } from "@patternfly/react-core";
import * as React from "react";
import { getFieldId } from "../../../../copiedFromConsole/formik-fields/field-utils";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import { CheckboxField } from "formik-pf";

const UseEscalatingCheckboxField = () => {
  const fieldName = "formData.useEscalating";
  const { t } = useNodeHealthCheckTranslation();
  const fieldId = getFieldId(fieldName, "checkbox");
  return (
    <FormGroup
      fieldId={fieldId}
      label={t("Use escalating remediation")}
      isInline={true}
    >
      <CheckboxField name={fieldName} />
    </FormGroup>
  );
};

export default UseEscalatingCheckboxField;
