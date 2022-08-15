import {
  BuiltInRemediationTemplate,
  InitialNodeHealthCheck,
  MatchExpressionOperator,
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
];

export const initialSpec = {
  selector: {
    matchExpressions: [
      {
        key: "node-role.kubernetes.io/worker",
        operator: MatchExpressionOperator.Exists,
      },
    ],
  },
  remediationTemplate: {
    apiVersion: getSnrTemplateApiVersion(),
    kind: snrTemplateKind.kind,
    name: BuiltInRemediationTemplate.ResourceDeletion,
    namespace: "openshift-operators",
  },
  minHealthy: DEFAULT_MIN_HEALTHY,
  unhealthyConditions: initialUnhealthyConditions,
};

export const initialNodeHealthCheckData: InitialNodeHealthCheck = {
  apiVersion: getNodeHealthCheckApiVersion(),
  kind: nodeHealthCheckKind.kind,
  metadata: {
    name: "",
  },
  spec: initialSpec,
};
