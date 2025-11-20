import { FormSection, Text, FormGroup } from "@patternfly/react-core";
import { useFormikContext } from "formik";
import * as React from "react";
import { getDefaultRemediator } from "../../../../data/remediator";
import { NodeHealthCheckFormValues } from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import CheckboxField from "../../../shared/CheckboxField";
import RemediatorField from "./RemediatorField";
import RemediatorsArrayField from "./RemediatorsArrayField";
import HelpIcon from "../../../shared/HelpIcon";

const UseEscalatingField = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <CheckboxField
      name="formData.useEscalating"
      label={t("Use escalating remediations")}
    />
  );
};

const RemediationTemplateField = () => {
  const { t } = useNodeHealthCheckTranslation();
  const { values, setFieldValue } =
    useFormikContext<NodeHealthCheckFormValues>();

  // Initialize with default remediator if not set
  React.useEffect(() => {
    const defaultRemediator = getDefaultRemediator();
    if (!values.formData.remediator) {
      setFieldValue("formData.remediator", defaultRemediator);
    }
    if (
      !values.formData.escalatingRemediations?.length &&
      values.formData.useEscalating
    ) {
      setFieldValue("formData.escalatingRemediations", [defaultRemediator]);
    }
  }, [
    values.formData.remediator,
    values.formData.escalatingRemediations,
    values.formData.useEscalating,
    setFieldValue,
  ]);
  const helpText = t(
    "A reference to a remediation template resource. If a node needs remediation the controller will create an object from this template and then it should be picked up by a remediation provider. Multiple escalating remediation templates can be configured by clicking the 'Use escalating remediations' checkbox."
  );

  const titleWithHelp = (
    <>
      {t("Remediation template")} <HelpIcon helpText={helpText} />
    </>
  );

  return (
    <FormSection title={titleWithHelp} titleElement="h2">
      <FormGroup>
        <UseEscalatingField />
        {!values.formData.useEscalating && (
          <RemediatorField fieldName={"formData.remediator"} />
        )}
        {values.formData.useEscalating && (
          <>
            <Text>
              {t(
                "Rearrange the templates using drag and drop or by editing the 'Order' field. The remediations will be executed in the specified order."
              )}
            </Text>
            <RemediatorsArrayField />
          </>
        )}
      </FormGroup>
    </FormSection>
  );
};

export default RemediationTemplateField;
