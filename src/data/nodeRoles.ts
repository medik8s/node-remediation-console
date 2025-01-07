import { NodeKind } from "../copiedFromConsole/types/node";
import { get, reduce, flatten, uniq } from "lodash-es";

const NODE_ROLE_PREFIX = "node-role.kubernetes.io/";

const getRoleLabel = (roleText: string) => `${NODE_ROLE_PREFIX}${roleText}`;
const masterLabel = getRoleLabel("master");

export enum Role {
  WORKER = "worker",
  CONTROL_PLANE = "control-plane",
}

export type ClusterRoleLabels = {
  [Role.CONTROL_PLANE]?: string;
  [Role.WORKER]?: string;
};

export const getClusterRoleLabels = (
  allNodes: NodeKind[]
): ClusterRoleLabels => {
  const res: ClusterRoleLabels = {};
  const masterLabel = getRoleLabel("master");
  const allLabels = flatten(
    allNodes.map((node) => Object.keys(node.metadata?.labels || {}))
  );
  for (const role of Object.values(Role)) {
    const label = getRoleLabel(role);
    if (allLabels.includes(label)) {
      res[role] = label;
    }
  }
  if (!res[Role.CONTROL_PLANE] && allLabels.includes(masterLabel)) {
    res[Role.CONTROL_PLANE] = masterLabel;
  }
  return res;
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
export const getClusterLabelOfRole = (allNodes: NodeKind[], role: Role) => {
  const masterLabel = `${NODE_ROLE_PREFIX}/master`;
  const allLabels = flatten(
    allNodes.map((node) => Object.keys(node.metadata?.labels || {}))
  );
  if (allLabels.includes(`${NODE_ROLE_PREFIX}/${role}`)) {
    return `${NODE_ROLE_PREFIX}/${role}`;
  } else if (allLabels.includes(masterLabel)) {
    return masterLabel;
  }
};

export const getNodeRolesText = (node: NodeKind): string => {
  return uniq(getNodeRoles(node)).sort().join(", ") ?? "-";
};
