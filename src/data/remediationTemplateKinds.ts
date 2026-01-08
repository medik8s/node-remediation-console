import { ExtensionK8sModel } from "@openshift-console/dynamic-plugin-sdk";

export const PREDEFINED_REMEDIATION_TEMPLATE_KINDS = [
  "SelfNodeRemediationTemplate", // First item - treated like all other kinds
  "FenceAgentsRemediationTemplate",
  "MachineDeletionRemediationTemplate",
] as const;

export type PredefinedRemediationTemplateKind =
  typeof PREDEFINED_REMEDIATION_TEMPLATE_KINDS[number];

export interface RemediationTemplateKindInfo {
  groupVersionKind: ExtensionK8sModel;
  operatorName: string;
}

const buildOperatorDetailsItem = (group: string): string => {
  // Extract the group name before the first dot (e.g., "self-node-remediation" from "self-node-remediation.medik8s.io")
  const groupPrefix = group.split(".")[0];
  return `${groupPrefix}-redhat-operators-openshift-marketplace`;
};

export const REMEDIATION_TEMPLATE_KIND_MAP: Record<
  PredefinedRemediationTemplateKind,
  RemediationTemplateKindInfo
> = {
  SelfNodeRemediationTemplate: {
    groupVersionKind: {
      group: "self-node-remediation.medik8s.io",
      version: "v1alpha1",
      kind: "SelfNodeRemediationTemplate",
    },
    operatorName: "Self Node Remediation Operator",
  },
  FenceAgentsRemediationTemplate: {
    groupVersionKind: {
      group: "fence-agents-remediation.medik8s.io", // TBD: verify actual group
      version: "v1alpha1", // TBD: verify actual version
      kind: "FenceAgentsRemediationTemplate",
    },
    operatorName: "Fence Agents Remediation Operator", // TBD: verify actual name
  },
  MachineDeletionRemediationTemplate: {
    groupVersionKind: {
      group: "machine-deletion-remediation.medik8s.io", // TBD: verify actual group
      version: "v1alpha1", // TBD: verify actual version
      kind: "MachineDeletionRemediationTemplate",
    },
    operatorName: "Machine Deletion Remediation Operator", // TBD: verify actual name
  },
};

// Note: Each predefined kind has its own API group and version.
// All kinds are treated equally - no special handling for SelfNodeRemediationTemplate.

export function getKindInfo(
  kind: string
): RemediationTemplateKindInfo | undefined {
  return REMEDIATION_TEMPLATE_KIND_MAP[
    kind as PredefinedRemediationTemplateKind
  ];
}

export function isPredefinedKind(kind: string): boolean {
  return PREDEFINED_REMEDIATION_TEMPLATE_KINDS.includes(
    kind as PredefinedRemediationTemplateKind
  );
}

export function getOperatorDetailsItem(
  kindInfo: RemediationTemplateKindInfo
): string {
  return buildOperatorDetailsItem(kindInfo.groupVersionKind.group);
}
