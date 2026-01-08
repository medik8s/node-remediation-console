import {
  ExtensionK8sKindVersionModel,
  ExtensionK8sModel,
  K8sModel,
} from "@openshift-console/dynamic-plugin-sdk";

export const getStringKind = (groupVersionKind: ExtensionK8sModel) =>
  `${groupVersionKind.group}~${groupVersionKind.version}~${groupVersionKind.kind}`;

export const getApiVersion = (groupVersionKind: ExtensionK8sModel) =>
  `${groupVersionKind.group}/${groupVersionKind.version}`;

/**
 * Parses an apiVersion string (format: "group/version") into its components
 * @param apiVersion - The apiVersion in format "group/version"
 * @returns Object with group and version, or undefined if invalid
 */
export const parseApiVersion = (
  apiVersion: string
): { group: string; version: string } | undefined => {
  if (!apiVersion) return undefined;
  const parts = apiVersion.split("/");
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { group: parts[0], version: parts[1] };
  }
  return undefined;
};

/**
 * Converts an apiVersion string and kind into a GroupVersionKind object
 * @param apiVersion - The apiVersion in format "group/version"
 * @param kind - The resource kind
 * @returns ExtensionK8sModel or undefined if invalid
 */
export const apiVersionToGroupVersionKind = (
  apiVersion: string,
  kind: string
): ExtensionK8sModel | undefined => {
  if (!apiVersion || !kind) return undefined;
  const parsed = parseApiVersion(apiVersion);
  if (!parsed) return undefined;
  return { group: parsed.group, version: parsed.version, kind };
};

/**
 * Constructs a URL for creating a new Kubernetes resource instance
 * @param apiVersion - The apiVersion in format "group/version"
 * @param kind - The resource kind
 * @returns URL in format "/k8s/cluster/{group}~{version}~{kind}/~new"
 */
export const getCreateInstanceUrl = (
  apiVersion: string,
  kind: string
): string | undefined => {
  if (!apiVersion || !kind) return undefined;
  const parsed = parseApiVersion(apiVersion);
  if (!parsed) return undefined;
  return `/k8s/cluster/${parsed.group}~${parsed.version}~${kind}/~new`;
};

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
