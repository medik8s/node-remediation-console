import * as React from "react";
import { useFormikContext } from "formik";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { Alert, TextInputTypes } from "@patternfly/react-core";
import InputField from "../../shared/InputField";
import NodeSelectionField from "./nodeSelectionField/NodeSelectionField";
import HelpIcon from "components/shared/HelpIcon";
import { FormViewFieldProps } from "./propTypes";
import { getObjectItemFieldName } from "components/shared/formik-utils";
import UnhealthyConditionsField from "./unhealthyConditionsField/UnhealthyConditionsField";
import { NodeHealthCheckFormValues } from "data/types";
import { NodeKind } from "copiedFromConsole/types/node";
import { withFallback } from "copiedFromConsole/error";
import RemediatorField from "./remediatorField/RemediatorField";

const MinHealthyField = ({ fieldName }: FormViewFieldProps) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <InputField
      required
      label={t("Min Healthy")}
      labelIcon={
        <HelpIcon
          helpText={t(
            "The minimum number or percentage of nodes that has to be healthy for the remediation to start."
          )}
        />
      }
      name={fieldName}
    />
  );
};

const NodeHealthCheckFormFields_: React.FC<{
  allNodes: NodeKind[];
  snrTemplatesExist: boolean;
}> = ({ allNodes, snrTemplatesExist }) => {
  const { t } = useNodeHealthCheckTranslation();
  const { values } = useFormikContext<NodeHealthCheckFormValues>();
  const formViewFieldName = "formData";

  return (
    <>
      <Alert
        isInline
        variant="info"
        title={t(
          `Note: Some fields may not be represented in this form view. Please select "YAML view" for full control`
        )}
        className="co-alert"
        id="info-inline-alert"
      ></Alert>
      <InputField
        type={TextInputTypes.text}
        required
        isDisabled={!values.isCreateFlow}
        name="formData.name"
        label={t("Name")}
        data-test="NodeHealthCheck-name"
        helpText={t("A unique name for the NodeHealthCheck")}
      />
      <RemediatorField
        formViewFieldName={formViewFieldName}
        snrTemplatesExist={snrTemplatesExist}
      ></RemediatorField>
      <NodeSelectionField
        allNodes={allNodes}
        formViewFieldName={formViewFieldName}
      />
      <MinHealthyField
        fieldName={getObjectItemFieldName([formViewFieldName, "minHealthy"])}
      />
      <UnhealthyConditionsField
        fieldName={getObjectItemFieldName([
          formViewFieldName,
          "unhealthyConditions",
        ])}
      ></UnhealthyConditionsField>
    </>
  );
};

const NodeHealthCheckFormFields = withFallback(NodeHealthCheckFormFields_);

export default NodeHealthCheckFormFields;
