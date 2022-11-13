import {
  BuiltInRemediationTemplate,
  InitialNodeHealthCheck,
  NodeHealthCheck,
  UnhealthyConditions,
  UnhealthyConditionStatus,
} from "./types";
import {
  getNodeHealthCheckApiVersion,
  getSnrTemplateApiVersion,
  nodeHealthCheckKind,
  snrTemplateKind,
} from "./model";

export const DEFAULT_MIN_HEALTHY = "51%";
export const OPERATORS_NAMESPACE = "openshift-operators";

const initialUnhealthyConditions: UnhealthyConditions = [
  {
    duration: "300s",
    status: UnhealthyConditionStatus.False,
    type: "Ready",
  },
  {
    duration: "300s",
    status: UnhealthyConditionStatus.Unknown,
    type: "Ready",
  },
];

export const defaultSpec = {
  remediationTemplate: {
    apiVersion: getSnrTemplateApiVersion(),
    kind: snrTemplateKind.kind,
    name: BuiltInRemediationTemplate.ResourceDeletion,
    namespace: "openshift-operators",
  },
  minHealthy: DEFAULT_MIN_HEALTHY,
  unhealthyConditions: initialUnhealthyConditions,
  selector: {},
};

export const initialNodeHealthCheck: NodeHealthCheck = {
  apiVersion: getNodeHealthCheckApiVersion(),
  kind: nodeHealthCheckKind.kind,
  metadata: {
    name: "",
  },
};

export const defaultNodeHealthCheck: InitialNodeHealthCheck = {
  ...initialNodeHealthCheck,
  spec: defaultSpec,
};
