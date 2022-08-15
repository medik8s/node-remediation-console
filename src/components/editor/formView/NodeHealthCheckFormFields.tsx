import * as React from "react";
import { useFormikContext } from "formik";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { Alert, FormSection, TextInputTypes } from "@patternfly/react-core";
import InputField from "../../shared/InputField";
import NodeSelectionField from "./nodeSelectionField/NodeSelectionField";
import HelpIcon from "components/shared/HelpIcon";
import { FormViewFieldProps } from "./propTypes";
import { getObjectItemFieldName } from "components/shared/formik-utils";
import UnhealthyConditionsField from "./unhealthyConditionsField/UnhealthyConditionsField";
import { NodeHealthCheckFormValues } from "data/types";
import { nodeKind } from "data/model";
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { NodeKind } from "copiedFromConsole/types/node";
import { FormBody } from "copiedFromConsole/form-utils";
import { useSnrTemplatesExist } from "apis/useSNRTemplatesExist";
import { withFallback } from "copiedFromConsole/error";
import RemediatorField from "./remediatorField/RemediatorField";
import { StatusBox } from "copiedFromConsole/utils/status-box";

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

const NodeHealthCheckFormFields_: React.FC = () => {
  const { t } = useNodeHealthCheckTranslation();
  const { values } = useFormikContext<NodeHealthCheckFormValues>();
  const formViewFieldName = "formData";
  const [allNodes, loaded, loadError] = useK8sWatchResource<NodeKind[]>({
    groupVersionKind: nodeKind,
    isList: true,
    namespaced: false,
  });

  const [snrTemplatesLoading, snrTemplatesExist] = useSnrTemplatesExist();

  return (
    <StatusBox
      loaded={loaded && !snrTemplatesLoading}
      loadError={loadError}
      data={allNodes}
    >
      <FormBody className="co-m-pane__form">
        <FormSection>
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
            fieldName={getObjectItemFieldName([
              formViewFieldName,
              "minHealthy",
            ])}
          />
          <UnhealthyConditionsField
            fieldName={getObjectItemFieldName([
              formViewFieldName,
              "unhealthyConditions",
            ])}
          ></UnhealthyConditionsField>
        </FormSection>
      </FormBody>
    </StatusBox>
  );
};

const NodeHealthCheckFormFields = withFallback(NodeHealthCheckFormFields_);

export default NodeHealthCheckFormFields;
