import { defaultSpec } from "./defaults";
import {
  getNodeSelector,
  getNodeSelectorLabelDisplayNames,
} from "./nodeSelector";
import { ParseErrorCode, throwParseError } from "./parseErrors";
import { getRemediator } from "./remediator";
import {
  UnhealthyCondition,
  NodeHealthCheck,
  FormViewValues,
  RemediationTemplate,
  Remediator,
  isBuiltInRemediationTemplate,
} from "./types";
import { MIN_HEALTHY_REGEX } from "./validationSchema";

export const DURATION_REGEX = /^([0-9]+(\.[0-9]+)?)(ns|us|µs|ms|s|m|h)$/;

const getRemediationTemplate = (
  initialRemediationTemplate: RemediationTemplate,
  remediator: Remediator
): RemediationTemplate => {
  if (isBuiltInRemediationTemplate(remediator.template)) {
    return {
      ...initialRemediationTemplate,
      name: remediator.template,
    };
  }
  return remediator.template;
};

const getUnhealthyConditionsValue = (
  nodeHealthCheck: NodeHealthCheck
): UnhealthyCondition[] => {
  try {
    return nodeHealthCheck.spec?.unhealthyConditions &&
      nodeHealthCheck.spec.unhealthyConditions.length > 0
      ? nodeHealthCheck.spec?.unhealthyConditions
      : defaultSpec.unhealthyConditions;
  } catch (err) {
    throwParseError(
      ParseErrorCode.INVALID_UNHEALTHY_CONDITIONS,
      "Unhealthy conditions field isn't an array"
    );
  }
};

export const getFormViewValues = (
  nodeHealthCheck: NodeHealthCheck
): FormViewValues => {
  return {
    name: nodeHealthCheck.metadata?.name,
    nodeSelectorLabels: getNodeSelectorLabelDisplayNames(nodeHealthCheck),
    minHealthy: (
      nodeHealthCheck.spec?.minHealthy ?? defaultSpec.minHealthy
    ).toString(),
    unhealthyConditions: getUnhealthyConditionsValue(nodeHealthCheck),
    remediator: getRemediator(
      defaultSpec.remediationTemplate,
      nodeHealthCheck.spec?.remediationTemplate
    ),
  };
};

export const getNodeHealthCheckMinHealthy = (minHealthy: string) => {
  let minHealthyVal: string | number = minHealthy;
  if (
    minHealthy &&
    minHealthy.match(MIN_HEALTHY_REGEX) &&
    !minHealthy.endsWith("%")
  ) {
    minHealthyVal = parseInt(minHealthy);
  }
  return minHealthyVal;
};

export const getSpec = (formViewFields: FormViewValues) => {
  const {
    nodeSelectorLabels: labelDisplayNames,
    minHealthy,
    unhealthyConditions,
  } = formViewFields;

  return {
    selector: getNodeSelector(labelDisplayNames),
    unhealthyConditions,
    minHealthy: getNodeHealthCheckMinHealthy(minHealthy),
    remediationTemplate: getRemediationTemplate(
      defaultSpec.remediationTemplate,
      formViewFields.remediator
    ),
  };
};

export const getNodeHealthCheck = (
  formViewValues: FormViewValues,
  yamlNodeHealthCheck: NodeHealthCheck
): NodeHealthCheck => {
  const formViewSpec = getSpec(formViewValues);
  const merged = {
    ...yamlNodeHealthCheck,
    metadata: {
      ...yamlNodeHealthCheck.metadata,
      name: formViewValues.name,
    },
    spec: {
      ...yamlNodeHealthCheck.spec,
      ...formViewSpec,
    },
  };
  return merged;
};
