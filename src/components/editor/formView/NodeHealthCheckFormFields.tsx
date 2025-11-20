import * as React from "react";
import { useFormikContext } from "formik";
import { Alert, Form, TextInputTypes } from "@patternfly/react-core";
import InputField from "../../../copiedFromConsole/formik-fields/InputField";
import NodeSelectionField from "./nodeSelectionField/NodeSelectionField";
import { FormViewFieldProps } from "./propTypes";
import UnhealthyConditionsField from "./unhealthyConditionsField/UnhealthyConditionsField";
import { withFallback } from "copiedFromConsole/error";
import HelpIcon from "components/shared/HelpIcon";
import { getObjectItemFieldName } from "../../shared/formik-utils";
import { NodeHealthCheckFormValues } from "../../../data/types";
import { useNodeHealthCheckTranslation } from "../../../localization/useNodeHealthCheckTranslation";
import RemediationTemplateField from "./remediatorField/RemediationTemplateField";
import "../../editor/nhc-form.css";

const MinHealthyField = ({ fieldName }: FormViewFieldProps) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <InputField
      required
      label={t("Min healthy")}
      labelIcon={
        <HelpIcon
          helpText={t(
            "The minimum percentage or number of nodes that has to be healthy for the remediation to start."
          )}
        />
      }
      name={fieldName}
      data-test="min-healthy"
    />
  );
};

const NodeHealthCheckFormFields_: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  const { values } = useFormikContext<NodeHealthCheckFormValues>();
  const formViewFieldName = "formData";
  return (
    <Form className="nhc-form-fields">
      <Alert
        isInline
        variant="info"
        title={t(
          `Some fields may not be represented in this form view. Please select "YAML view" for full control`
        )}
        id="info-inline-alert"
      />
      <InputField
        type={TextInputTypes.text}
        required
        isDisabled={!values.isCreateFlow}
        name="formData.name"
        label={t("Name")}
        data-test="NodeHealthCheck-name"
        helpText={t("A unique name for the NodeHealthCheck")}
      />
      <RemediationTemplateField />

      <NodeSelectionField
        fieldName={getObjectItemFieldName([formViewFieldName, "nodeSelector"])}
      />
      <MinHealthyField
        fieldName={getObjectItemFieldName([formViewFieldName, "minHealthy"])}
      />
      <UnhealthyConditionsField
        fieldName={getObjectItemFieldName([
          formViewFieldName,
          "unhealthyConditions",
        ])}
      />
    </Form>
  );
};

const NodeHealthCheckFormFields = withFallback(NodeHealthCheckFormFields_);

export default NodeHealthCheckFormFields;
