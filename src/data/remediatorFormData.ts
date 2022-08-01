import * as _ from "lodash";
import { initialNodeHealthCheckData } from "./initialNodeHealthCheckData";
import {
  RemediationTemplate,
  FormDataRemediator,
  RemediatorKind,
  isBuiltInRemediationTemplate,
  BuiltInRemediationTemplate,
  NodeHealthCheck,
} from "./types";

export const SNR_LABEL = "Self node remediation";
export const OTHER_LABEL = "Other";

const getBuiltInRemediatorTemplate = (
  initialRemediationTemplate: RemediationTemplate,
  remediationTemplate: RemediationTemplate
): BuiltInRemediationTemplate | null => {
  const commonProps = ["kind", "namespace", "apiVersion"];
  const commonPropsEqual = _.isEqual(
    _.pick(initialRemediationTemplate, commonProps),
    _.pick(remediationTemplate, commonProps)
  );
  if (!commonPropsEqual) {
    return null;
  }

  if (isBuiltInRemediationTemplate(remediationTemplate.name)) {
    return remediationTemplate.name;
  }
  return null;
};

export const getRemediator = (
  initialRemediationTemplate: RemediationTemplate,
  remediationTemplate: RemediationTemplate | undefined
): FormDataRemediator => {
  if (!remediationTemplate) {
    return {
      kind: RemediatorKind.SNR,
      template: BuiltInRemediationTemplate.ResourceDeletion,
    };
  }
  const builtInTemplate = getBuiltInRemediatorTemplate(
    initialRemediationTemplate,
    remediationTemplate
  );
  if (builtInTemplate) {
    return {
      kind: RemediatorKind.SNR,
      template: builtInTemplate,
    };
  }
  return {
    kind: RemediatorKind.CUSTOM,
    template: remediationTemplate,
  };
};

export const getRemediatorLabel = (kind: RemediatorKind) =>
  kind === RemediatorKind.SNR ? SNR_LABEL : OTHER_LABEL;

export const getRemediatorKind = (
  nodeHealthCheck: NodeHealthCheck
): RemediatorKind | null => {
  if (!nodeHealthCheck.spec || !nodeHealthCheck.spec.remediationTemplate) {
    return undefined;
  }
  return getRemediator(
    initialNodeHealthCheckData.spec.remediationTemplate,
    nodeHealthCheck.spec.remediationTemplate
  ).kind;
};

export const getNodeHealthCheckRemediatorLabel = (
  nodeHealthCheck: NodeHealthCheck
): string | null => {
  return getRemediatorLabel(getRemediatorKind(nodeHealthCheck));
};
