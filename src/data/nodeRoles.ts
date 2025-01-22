import { TFunction } from "i18next";
import { NodeKind } from "../copiedFromConsole/types/node";
import { get, reduce, uniq } from "lodash-es";

const NODE_ROLE_PREFIX = "node-role.kubernetes.io/";

export const getRoleLabel = (roleText: string) =>
  `${NODE_ROLE_PREFIX}${roleText}`;
const masterLabel = getRoleLabel("master");

export const getRoleTitle = (t: TFunction, role: Role): string => {
  if (role === Role.WORKER) {
    return t("Worker");
  }
  return t("Control plane");
};

export enum Role {
  WORKER = "worker",
  CONTROL_PLANE = "control-plane",
}

export type ClusterRoleLabels = Array<{
  title: string;
  value: string;
}>;

export const getClusterRoleLabels = (
  t: TFunction,
  nodeLabels: string[]
): ClusterRoleLabels => {
  const roleLabels: ClusterRoleLabels = [];

  for (const role of Object.values(Role)) {
    const label = getRoleLabel(role);
    if (nodeLabels.includes(label)) {
      roleLabels.push({
        value: label,
        title: getRoleTitle(t, role),
      });
    }
  }
  if (
    !nodeLabels.includes(getRoleLabel(Role.CONTROL_PLANE)) &&
    nodeLabels.includes(masterLabel)
  ) {
    roleLabels.push({
      value: masterLabel,
      title: getRoleTitle(t, Role.CONTROL_PLANE),
    });
  }

  return roleLabels;
};

export const getNodeRoles = (node: NodeKind): string[] => {
  const labels = get(node, "metadata.labels");
  return reduce(
    labels,
    (acc: string[], v: string, label: string) => {
      if (!label.startsWith(NODE_ROLE_PREFIX)) {
        return acc;
      }
      const role = label.slice(NODE_ROLE_PREFIX.length);
      if (!role) {
        return acc;
      }
      if (label === masterLabel) {
        return [...acc, Role.CONTROL_PLANE];
      }
      return [...acc, role];
    },
    []
  );
};

export const getNodeRolesText = (node: NodeKind): string => {
  return uniq(getNodeRoles(node)).sort().join(", ") ?? "-";
};
