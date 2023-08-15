import {
  EscalatingRemediator,
  NodeHealthCheck,
  RemediationTemplate,
  Remediator,
  RemediatorRadioOption,
} from "./types";
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
  if (
    !nodeHealthCheck.spec ||
    (!nodeHealthCheck.spec.remediationTemplate &&
      !nodeHealthCheck.spec.escalatingRemediations)
  ) {
    return undefined;
  }
  if (nodeHealthCheck.spec.escalatingRemediations?.length > 0) {
    return t("Escalating remediations");
  }
  const remediationTemplate = nodeHealthCheck.spec.remediationTemplate;
  return remediationTemplate.kind === snrTemplateKind.kind
    ? getSNRLabel(t)
    : remediationTemplate.kind;
};

export const getDefaultRemediator = (
  snrTemplate: RemediationTemplate | undefined
): Remediator => {
  return {
    radioOption: snrTemplate
      ? RemediatorRadioOption.SNR
      : RemediatorRadioOption.CUSTOM,
    template: snrTemplate ? snrTemplate : getEmptyRemediationTemplate(),
    order: "",
    id: Math.random(),
  };
};

export const getSortedRemediators = (
  remediators: (EscalatingRemediator | Remediator)[]
): (EscalatingRemediator | Remediator)[] =>
  [...remediators].sort(
    (remediator1, remediator2) =>
      (remediator1.order || 0) - (remediator2.order || 0)
  );
