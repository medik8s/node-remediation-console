import { EditorType } from "copiedFromConsole/synced-editor/editor-toggle";
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
import { getPauseRequests } from "./nodeHealthCheck";

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
  existingNodeHealthCheck: NodeHealthCheck
) => {
  const formDataSpec = formDataToNodeHealthCheckSpec(formData);
  const pauseRequests = getPauseRequests(existingNodeHealthCheck);
  return {
    ...initialNodeHealthCheckData,
    ...existingNodeHealthCheck,
    metadata: {
      ...existingNodeHealthCheck?.metadata,
      name: formData.name,
    },
    spec: {
      ...formDataSpec,
      pauseRequests: pauseRequests.length > 0 ? pauseRequests : undefined,
    },
  };
};

export const yamlTextToNodeHealthCheck = (
  existingNodeHealthCheck: NodeHealthCheck,
  yamlText: string
): NodeHealthCheck => {
  const nodeHealthCheck = load(yamlText) as NodeHealthCheck;
  return nodeHealthCheck;
};

export const toNodeHealthCheck = (
  existingNodeHealthCheck: NodeHealthCheck | undefined,
  values: NodeHealthCheckFormValues
): NodeHealthCheck => {
  const nodeHealthCheckYaml = yamlTextToNodeHealthCheck(
    existingNodeHealthCheck,
    values.yamlData
  );
  if (values.editorType === EditorType.YAML) {
    return nodeHealthCheckYaml;
  }

  return formDataToNodeHealthCheck(values.formData, nodeHealthCheckYaml);
};
