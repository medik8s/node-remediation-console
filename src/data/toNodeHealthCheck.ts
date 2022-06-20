import { EditorType } from "components/copiedFromConsole/synced-editor/editor-toggle";
import * as _ from "lodash";
import {
  NodeHealthCheck,
  NodeHealthCheckFormData,
  NodeHealthCheckFormValues,
  FormDataRemediator,
  RemediationTemplate,
  isBuiltInRemediationTemplate,
} from "./types";
import { initialNodeHealthCheckData } from "./initialNodeHealthCheckData";
import { load } from "js-yaml";
import { getNodeSelector } from "./nodeSelectorData";

const getRemediatorTemplate = (
  initialRemediationTemplate: RemediationTemplate,
  remediator: FormDataRemediator
): RemediationTemplate => {
  if (isBuiltInRemediationTemplate(remediator.template)) {
    return {
      ...initialRemediationTemplate,
      name: remediator.template,
    };
  }
  return remediator.template;
};

export const formDataToNodeHealthCheckSpec = (
  formData: NodeHealthCheckFormData
) => {
  const { labelDisplayNames, minHealthy, unhealthyConditions } = formData;
  return {
    selector: getNodeSelector(labelDisplayNames),
    unhealthyConditions,
    minHealthy: minHealthy,
    remediationTemplate: getRemediatorTemplate(
      initialNodeHealthCheckData.spec.remediationTemplate,
      formData.remediator
    ),
  };
};

export const formDataToNodeHealthCheck = (
  formData: NodeHealthCheckFormData,
  existingNodeHealthCheck?: NodeHealthCheck
) => {
  const { name } = formData;
  return {
    ...initialNodeHealthCheckData,
    ...existingNodeHealthCheck,
    metadata: {
      ...existingNodeHealthCheck?.metadata,
      name,
    },
    spec: formDataToNodeHealthCheckSpec(formData),
  };
};

export const toNodeHealthCheck = (
  values: NodeHealthCheckFormValues
): NodeHealthCheck => {
  const yamlData = load(values.yamlData);
  if (values.editorType === EditorType.YAML) {
    return yamlData;
  }
  return formDataToNodeHealthCheck(values.formData, yamlData);
};
