import {
  FormGroup,
  Skeleton,
  Stack,
  StackItem,
  Text,
} from "@patternfly/react-core";
import { useFormikContext } from "formik";
import { CheckboxField } from "formik-pf";
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
    <Stack hasGutter>
      <StackItem>
        <FormGroup
          label={t("Remediation template")}
          isRequired
          fieldId="remediation-template"
          style={{ padding: "unset" }}
        />
      </StackItem>
      <StackItem>
        <Text>
          {t(
            "By default we use the single remediation template. Select 'Use escalating remediations' for creating a list of remediation templates with execution order and timeout"
          )}
        </Text>
      </StackItem>
      <StackItem>
        <CheckboxField
          name="formData.useEscalating"
          label={t("Use escalating remediations")}
        />
      </StackItem>
      {!loaded && (
        <StackItem>
          <Loading />
        </StackItem>
      )}
      {loaded && !values.formData.useEscalating && (
        <StackItem>
          <RemediatorField
            fieldName={"formData.remediator"}
            snrTemplate={snrTemplate}
          />
        </StackItem>
      )}
      {loaded && values.formData.useEscalating && (
        <StackItem>
          <RemediatorsArrayField snrTemplateResult={snrTemplateResult} />
        </StackItem>
      )}
    </Stack>
  );
};

export default RemediationTemplateField;
