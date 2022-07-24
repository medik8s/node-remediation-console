import * as _ from "lodash";
import { initialNodeHealthCheckData } from "./initialNodeHealthCheckData";
import { getNodeSelectorLabelDisplayNames } from "./nodeSelectorData";
import { ParseErrorCode, throwParseError } from "./parseErrors";
import { getRemediator } from "./remediatorFormData";
import { getSelector, getUnhealthyConditions } from "./nodeHealthCheck";
import {
  UnhealthyCondition,
  NodeHealthCheck,
  NodeHealthCheckFormData,
  FormDataUnhealthyCondition,
} from "./types";

export const DURATION_REGEX = /^([0-9]+(\.[0-9]+)?)(ns|us|µs|ms|s|m|h)$/;

const validateUnhealthyConditions = (
  unhealthyConditions: UnhealthyCondition[],
  deleteInvalid: boolean
): FormDataUnhealthyCondition[] => {
  if (!Array.isArray(unhealthyConditions)) {
    if (deleteInvalid) {
      return [];
    }
    throwParseError(
      ParseErrorCode.INVALID_UNHEALTHY_CONDITIONS,
      "Unhealthy conditions field isn't an array"
    );
  }
  return unhealthyConditions;
};

export const getFormData = (
  nodeHealthCheck: NodeHealthCheck,
  deleteInvalid: boolean
): NodeHealthCheckFormData => {
  const unhealthyConditions = getUnhealthyConditions(nodeHealthCheck);
  return {
    name: nodeHealthCheck.metadata?.name,
    labelDisplayNames: getNodeSelectorLabelDisplayNames(
      getSelector(nodeHealthCheck),
      deleteInvalid
    ),
    minHealthy:
      nodeHealthCheck.spec?.minHealthy ||
      initialNodeHealthCheckData.spec.minHealthy,
    unhealthyConditions: validateUnhealthyConditions(
      unhealthyConditions.length > 1
        ? unhealthyConditions
        : initialNodeHealthCheckData.spec.unhealthyConditions,
      deleteInvalid
    ),
    remediator: getRemediator(
      initialNodeHealthCheckData.spec.remediationTemplate,
      nodeHealthCheck.spec?.remediationTemplate
    ),
  };
};

export const getInitialFormData = () => {
  return getFormData(initialNodeHealthCheckData, false);
};
