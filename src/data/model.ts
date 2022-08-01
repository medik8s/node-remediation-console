import {
  ExtensionK8sKindVersionModel,
  ExtensionK8sModel,
  K8sModel,
} from "@openshift-console/dynamic-plugin-sdk";

const getStringKind = (groupVersionKind: ExtensionK8sModel) =>
  `${groupVersionKind.group}~${groupVersionKind.version}~${groupVersionKind.kind}`;

const getApiVersion = (groupVersionKind: ExtensionK8sModel) =>
  `${groupVersionKind.group}/${groupVersionKind.version}`;

export const nodeKind: ExtensionK8sKindVersionModel = {
  kind: "Node",
  version: "v1",
};

export const nodeHealthCheckKind: ExtensionK8sModel = {
  kind: "NodeHealthCheck",
  group: "remediation.medik8s.io",
  version: "v1alpha1",
};

export const nodeHealthCheckStringKind = getStringKind(nodeHealthCheckKind);

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

export const getNodeHealthCheckApiVersion = () => {
  return getApiVersion(nodeHealthCheckKind);
};

export const machineHealthCheckKind: ExtensionK8sModel = {
  kind: "MachineHealthCheck",
  group: "machine.openshift.io",
  version: "v1beta1",
};

export const namespaceKind: ExtensionK8sKindVersionModel = {
  kind: "Namespace",
  version: "v1",
};

export const snrTemplateKind: ExtensionK8sModel = {
  kind: "SelfNodeRemediationTemplate",
  group: "self-node-remediation.medik8s.io",
  version: "v1alpha1",
};

export const snrTemplateStringKind = getStringKind(snrTemplateKind);

export const getSnrTemplateApiVersion = () => getApiVersion(snrTemplateKind);
