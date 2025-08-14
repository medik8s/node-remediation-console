import { FormSection, Skeleton, Text, FormGroup } from "@patternfly/react-core";
import { useFormikContext } from "formik";
import { range } from "lodash";
import * as React from "react";
import { getDefaultRemediator } from "../../../../data/remediator";
import {
  NodeHealthCheckFormValues,
  SnrTemplateResult,
} from "../../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../../localization/useNodeHealthCheckTranslation";
import CheckboxField from "../../../shared/CheckboxField";
import RemediatorField from "./RemediatorField";
import RemediatorsArrayField from "./RemediatorsArrayField";

const UseEscalatingField = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <CheckboxField
      name="formData.useEscalating"
      label={t("Use escalating remediations")}
    />
  );
};

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
    if (!values.formData.escalatingRemediations?.length) {
      setFieldValue("formData.escalatingRemediations", [
        { ...defaultRemediator, order: 0 },
      ]);
    }
  }, [
    loaded,
    values.formData.remediator,
    values.formData.escalatingRemediations,
    setFieldValue,
    snrTemplate,
  ]);
  return (
    <FormSection title={t("Remediation")} titleElement="h2">
      <FormGroup>
        <UseEscalatingField />
        {!loaded && <Loading />}
        {loaded && !values.formData.useEscalating && (
          <RemediatorField
            fieldName={"formData.remediator"}
            snrTemplate={snrTemplate}
          />
        )}
        {loaded && values.formData.useEscalating && (
          <>
            <Text>
              {t(
                "Rearrange the templates using drag and drop or by editing the ‘Order’ field. The remediations will be executed in the specified order."
              )}
            </Text>
            <RemediatorsArrayField snrTemplateResult={snrTemplateResult} />
          </>
        )}
      </FormGroup>
    </FormSection>
  );
};

export default RemediationTemplateField;
