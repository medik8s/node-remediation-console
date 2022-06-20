import { K8sModel } from "@openshift-console/dynamic-plugin-sdk";

export const nodeKind = {
  kind: "Node",
  version: "v1",
};

export const nodeHealthCheckKind = {
  kind: "NodeHealthCheck",
  group: "remediation.medik8s.io",
  version: "v1alpha1",
};

export const nodeHealthCheckStringKind = `${nodeHealthCheckKind.group}~${nodeHealthCheckKind.version}~${nodeHealthCheckKind.kind}`;

export const NodeHealthCheckModel: K8sModel = {
  apiVersion: nodeHealthCheckKind.version,
  apiGroup: nodeHealthCheckKind.group,
  label: nodeHealthCheckKind.kind,
  labelKey: nodeHealthCheckKind.kind,
  plural: "nodehealthchecks",
  abbr: "NHC",
  namespaced: false,
  kind: nodeHealthCheckKind.kind,
  id: "nodeHealthCheck",
  labelPlural: "NodeHealthChecks",
  labelPluralKey: "NodeHealthChecks",
};

export const getVersion = () => {
  return `${nodeHealthCheckKind.group}/${nodeHealthCheckKind.version}`;
};
