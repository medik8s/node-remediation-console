import * as _ from "lodash";
import { initialNodeHealthCheckData } from "./initialNodeHealthCheckData";
import { getNodeSelectorLabelDisplayNames } from "./nodeSelectorData";
import { ParseErrorCode, throwParseError } from "./parseErrors";
import { getRemediator } from "./remediatorFormData";
import {
  UnhealthyCondition,
  NodeHealthCheck,
  NodeHealthCheckFormData,
  FormDataUnhealthyCondition,
} from "./types";

export const DURATION_REGEX = /^([0-9]+(\.[0-9]+)?)(ns|us|µs|ms|s|m|h)$/;

const getUnhealthyConditions = (
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
  return {
    name: nodeHealthCheck.metadata?.name,
    labelDisplayNames: getNodeSelectorLabelDisplayNames(
      nodeHealthCheck.spec?.selector,
      deleteInvalid
    ),
    minHealthy: nodeHealthCheck.spec?.minHealthy,
    unhealthyConditions: getUnhealthyConditions(
      nodeHealthCheck.spec?.unhealthyConditions,
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
