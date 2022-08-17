import * as _ from "lodash";
import { defaultSpec } from "./defaults";
import {
  getNodeSelector,
  getNodeSelectorLabelDisplayNames,
} from "./nodeSelector";
import { ParseErrorCode, throwParseError } from "./parseErrors";
import { getRemediator } from "./remediator";
import { getSelector, getUnhealthyConditions } from "./nodeHealthCheck";
import {
  UnhealthyCondition,
  NodeHealthCheck,
  FormViewValues,
  RemediationTemplate,
  Remediator,
  isBuiltInRemediationTemplate,
} from "./types";

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
  unhealthyConditions: UnhealthyCondition[]
): UnhealthyCondition[] => {
  try {
    return unhealthyConditions.length > 1
      ? unhealthyConditions
      : defaultSpec.unhealthyConditions;
  } catch (err) {
    throwParseError(
      ParseErrorCode.INVALID_UNHEALTHY_CONDITIONS,
      "Unhealthy conditions field isn't an array"
    );
  }
  return unhealthyConditions;
};

export const getFormViewValues = (
  nodeHealthCheck: NodeHealthCheck
): FormViewValues => {
  const unhealthyConditions = getUnhealthyConditionsValue(
    getUnhealthyConditions(nodeHealthCheck)
  );
  return {
    name: nodeHealthCheck.metadata?.name,
    nodeSelectorLabels: getNodeSelectorLabelDisplayNames(
      getSelector(nodeHealthCheck)
    ),
    minHealthy: nodeHealthCheck.spec?.minHealthy || defaultSpec.minHealthy,
    unhealthyConditions: getUnhealthyConditionsValue(
      unhealthyConditions.length > 1
        ? unhealthyConditions
        : defaultSpec.unhealthyConditions
    ),
    remediator: getRemediator(
      defaultSpec.remediationTemplate,
      nodeHealthCheck.spec?.remediationTemplate
    ),
  };
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
    minHealthy: minHealthy,
    remediationTemplate: getRemediationTemplate(
      defaultSpec.remediationTemplate,
      formViewFields.remediator
    ),
  };
};

export const getNodeHealthCheck = (
  formViewValues: FormViewValues,
  yamlNodeHealthCheck: NodeHealthCheck
) => {
  //For all fields except of selector, it behaves like other CRs: it merges the yaml with the form
  //for the field selector, the source of truth is the form view since the list of nodes viewed does not take into account matchExpressions
  const formViewSpec = getSpec(formViewValues);
  const merged = _.merge({}, yamlNodeHealthCheck, {
    metadata: {
      name: formViewValues.name,
    },
    spec: formViewSpec,
  });
  merged.spec.selector = formViewSpec.selector;
  return merged;
};
