import { FormGroup, Skeleton } from "@patternfly/react-core";
import { useFormikContext } from "formik";
import { range } from "lodash";
import * as React from "react";
import { getEmptyRemediationTemplate } from "../../../../data/remediator";
import {
  NodeHealthCheckFormValues,
  RemediationTemplate,
  Remediator,
  RemediatorRadioOption,
  SnrTemplateResult,
} from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import RemediatorField from "./RemediatorField";
import RemediatorsArrayField from "./RemediatorsArrayField";
import UseEscalatingCheckboxField from "./UseEcalatingCheckboxField";

const getDefaultRemediator = (
  snrTemplate: RemediationTemplate | undefined
): Remediator => {
  return {
    radioOption: snrTemplate
      ? RemediatorRadioOption.SNR
      : RemediatorRadioOption.CUSTOM,
    template: snrTemplate ? snrTemplate : getEmptyRemediationTemplate(),
  };
};
const Loading = () => (
  <>
    {range(0, 5).map((idx) => (
      <Skeleton />
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
    if (!loaded) {
      return;
    }
    if (!values.formData.remediator) {
      setFieldValue("formData.remediator", getDefaultRemediator(snrTemplate));
    }
    if (!values.formData.escalatingRemediators) {
      setFieldValue("formData.remediator", getDefaultRemediator(snrTemplate));
    }
  }, [
    loaded,
    values.formData.remediator,
    values.formData.escalatingRemediators,
    setFieldValue,
  ]);
  return (
    <FormGroup title={t("Remediation template")} fieldId="remediation-template">
      <UseEscalatingCheckboxField />
      {!loaded && <Loading />}
      {loaded && !values.formData.useEscalating && (
        <RemediatorField
          fieldName={"formData.remediator"}
          snrTemplateResult={snrTemplateResult}
        />
      )}
      {loaded && values.formData.useEscalating && (
        <RemediatorsArrayField snrTemplateResult={snrTemplateResult} />
      )}
    </FormGroup>
  );
};

export default RemediationTemplateField;
