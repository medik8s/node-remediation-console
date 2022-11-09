import { defaultSpec } from "./defaults";
import {
  RemediationTemplate,
  Remediator,
  RemediatorLabel,
  isBuiltInRemediationTemplate,
  BuiltInRemediationTemplate,
  NodeHealthCheck,
} from "./types";
import { pick, isEqual } from "lodash-es";

const getBuiltInRemediatorTemplate = (
  initialRemediationTemplate: RemediationTemplate,
  remediationTemplate: RemediationTemplate
): BuiltInRemediationTemplate | null => {
  const commonProps = ["kind", "namespace", "apiVersion"];
  const commonPropsEqual = isEqual(
    pick(initialRemediationTemplate, commonProps),
    pick(remediationTemplate, commonProps)
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
): Remediator => {
  if (!remediationTemplate) {
    return {
      label: RemediatorLabel.SNR,
      template: BuiltInRemediationTemplate.ResourceDeletion,
    };
  }
  const builtInTemplate = getBuiltInRemediatorTemplate(
    initialRemediationTemplate,
    remediationTemplate
  );
  if (builtInTemplate) {
    return {
      label: RemediatorLabel.SNR,
      template: builtInTemplate,
    };
  }
  return {
    label: RemediatorLabel.CUSTOM,
    template: remediationTemplate,
  };
};

export const getRemediatorLabel = (
  nodeHealthCheck: NodeHealthCheck
): RemediatorLabel | null => {
  if (!nodeHealthCheck.spec || !nodeHealthCheck.spec.remediationTemplate) {
    return undefined;
  }
  return getRemediator(
    defaultSpec.remediationTemplate,
    nodeHealthCheck.spec.remediationTemplate
  ).label;
};
