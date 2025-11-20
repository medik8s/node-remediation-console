import {
  EscalatingRemediator,
  NodeHealthCheck,
  RemediationTemplate,
  Remediator,
} from "./types";
import { TFunction } from "i18next";
import {
  PREDEFINED_REMEDIATION_TEMPLATE_KINDS,
  getKindInfo,
} from "./remediationTemplateKinds";
import { getApiVersion } from "./model";

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
  return remediationTemplate?.kind;
};

export const getDefaultRemediator = (): Remediator => {
  const defaultKind = PREDEFINED_REMEDIATION_TEMPLATE_KINDS[0];
  const kindInfo = getKindInfo(defaultKind);
  const defaultApiVersion = kindInfo
    ? getApiVersion(kindInfo.groupVersionKind)
    : "";

  return {
    template: {
      apiVersion: defaultApiVersion,
      kind: defaultKind,
      name: "",
      namespace: "",
    },
    order: "",
    id: Math.random(),
  };
};
export const getSortedRemediators = <
  R extends EscalatingRemediator | Remediator
>(
  remediators: R[]
): R[] =>
  [...remediators].sort(
    (remediator1, remediator2) =>
      (remediator1.order || 0) - (remediator2.order || 0)
  );

/**
 * Checks if a remediation template has both name and namespace (is fully selected)
 * @param template - The remediation template
 * @returns true if template has both name and namespace
 */
export const isRemediationTemplateSelected = (
  template: RemediationTemplate | undefined
): boolean => {
  return !!template?.name;
};
