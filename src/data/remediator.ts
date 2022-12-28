import { NodeHealthCheck, RemediationTemplate } from "./types";
import { snrTemplateKind } from "./model";
import { TFunction } from "i18next";

export const getSNRLabel = (t: TFunction) => t("Self node remediation");

export const getEmptyRemediationTemplate = (): RemediationTemplate => ({
  apiVersion: "",
  kind: "",
  name: "",
  namespace: "",
});

export const getRemediatorLabel = (
  nodeHealthCheck: NodeHealthCheck,
  t: TFunction
): string | undefined => {
  if (!nodeHealthCheck.spec || !nodeHealthCheck.spec.remediationTemplate) {
    return undefined;
  }
  const remediationTemplate = nodeHealthCheck.spec.remediationTemplate;
  return remediationTemplate.kind === snrTemplateKind.kind
    ? getSNRLabel(t)
    : remediationTemplate.kind;
};
