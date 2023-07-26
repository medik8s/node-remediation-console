import { FormGroup, Skeleton } from "@patternfly/react-core";
import { useFormikContext } from "formik";
import { range } from "lodash";
import * as React from "react";
import { getDefaultRemediator } from "../../../../data/remediator";
import {
  NodeHealthCheckFormValues,
  SnrTemplateResult,
} from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import RemediatorField from "./RemediatorField";
import RemediatorsArrayField from "./RemediatorsArrayField";
import UseEscalatingCheckboxField from "./UseEcalatingCheckboxField";

const Loading = () => (
  <>
    {range(0, 5).map((idx) => (
      <Skeleton key={idx} />
    ))}
  </>
);

const RemediationTemplateField = ({
  snrTemplateResult,
}: {
  snrTemplateResult: SnrTemplateResult;
}) => {
  const [snrTemplate, loaded] = snrTemplateResult;
  const { t } = useNodeHealthCheckTranslation();
  const { values, setFieldValue } =
    useFormikContext<NodeHealthCheckFormValues>();

  React.useEffect(() => {
    const defaultRemediator = getDefaultRemediator(snrTemplate);
    if (!loaded) {
      return;
    }
    if (!values.formData.remediator) {
      setFieldValue("formData.remediator", defaultRemediator);
    }
    if (!values.formData.escalatingRemediators?.length) {
      setFieldValue("formData.escalatingRemediators", [
        { ...defaultRemediator, order: 0 },
      ]);
    }
  }, [
    loaded,
    values.formData.remediator,
    values.formData.escalatingRemediators,
    setFieldValue,
    snrTemplate,
  ]);
  return (
    <FormGroup title={t("Remediation template")} fieldId="remediation-template">
      <UseEscalatingCheckboxField />
      {!loaded && <Loading />}
      {loaded && !values.formData.useEscalating && (
        <RemediatorField
          fieldName={"formData.remediator"}
          snrTemplate={snrTemplate}
        />
      )}
      {loaded && values.formData.useEscalating && (
        <RemediatorsArrayField snrTemplateResult={snrTemplateResult} />
      )}
    </FormGroup>
  );
};

export default RemediationTemplateField;
