import {
  MatchLabels,
  ObjectMetadata,
} from "@openshift-console/dynamic-plugin-sdk";
import { EditorType } from "../components/copiedFromConsole/synced-editor/editor-toggle";

export enum UnhealthyConditionStatus {
  False = "False",
  True = "True",
  Unknown = "Unknown",
}

export enum UnhealtyConditionType {
  Ready = "Ready",
  MemoryPressure = "MemoryPressure",
  DiskPressure = "DiskPressure",
  PIDPressure = "PIDPressure",
  NetworkUnavailable = "NetworkUnavailable",
}

export type UnhealthyCondition = {
  duration: string;
  status: UnhealthyConditionStatus;
  type: string;
};

export type RemediationTemplate = {
  apiVersion: string;
  kind: string;
  name: string;
  namespace: string;
};

export type UnhealthyConditions = UnhealthyCondition[];

export type PauseRequest = {};

export enum MatchExpressionOperator {
  In = "In",
  NotIn = "NotIn",
  Exists = "Exists",
  DoesNotExist = "DoesNotExist",
}

export type MatchExpression = {
  key: string;
  operator: MatchExpressionOperator;
  values?: string[];
};

export type NodeSelector = {
  matchLabels?: MatchLabels;
  matchExpressions?: MatchExpression[];
};

export type NodeHealthCheckSpec = {
  selector?: NodeSelector;
  remediationTemplate: RemediationTemplate;
  minHealthy?: string;
  unhealthyConditions?: UnhealthyConditions;
  pauseRequests?: string[];
};

export type BasicResourceInfo = {
  apiVersion: string;
  kind: string;
  metadata: ObjectMetadata;
};

export type InitialNodeHealthCheck = {
  spec: Omit<Required<NodeHealthCheckSpec>, "pauseRequests">;
} & BasicResourceInfo;

export enum StatusPhase {
  ENABLED = "Enabled",
  DISABLED = "Disabled",
  REMEDIATING = "Remediating",
  PAUSED = "Paused",
}

export type NodeHealthCheckStatus = {
  phase?: StatusPhase;
  reason?: string;
  observedNodes?: number;
  healthyNodes?: number;
};

export type NodeHealthCheck = BasicResourceInfo & {
  spec?: NodeHealthCheckSpec;
  status?: NodeHealthCheckStatus;
};

export enum TimeUnit {
  Hour = "h",
  Minute = "m",
  Second = "s",
  NanoSecond = "ns",
  MilliSecond = "ms",
}

export enum RemediatorKind {
  SNR = "SNR",
  CUSTOM = "Other",
}

export enum BuiltInRemediationTemplate {
  NodeDeletion = "self-node-remediation-node-deletion-template",
  ResourceDeletion = "self-node-remediation-resource-deletion-template",
}

export type FormDataRemediatorTemplate =
  | BuiltInRemediationTemplate
  | RemediationTemplate;

export type FormDataRemediator = {
  kind: RemediatorKind;
  template: FormDataRemediatorTemplate;
};

export const isBuiltInRemediationTemplate = (
  template: BuiltInRemediationTemplate | RemediationTemplate | string
): template is BuiltInRemediationTemplate => {
  if (typeof template !== "string") {
    return false;
  }
  return (
    template === BuiltInRemediationTemplate.NodeDeletion ||
    template === BuiltInRemediationTemplate.ResourceDeletion
  );
};

export type FormDataUnhealthyCondition = UnhealthyCondition;

export type NodeHealthCheckFormData = {
  name: string;
  labelDisplayNames: string[];
  minHealthy: string;
  unhealthyConditions: FormDataUnhealthyCondition[];
  remediator: FormDataRemediator;
};

export type NodeHealthCheckFormValues = {
  isCreateFlow: boolean;
  editorType: EditorType;
  yamlData: string;
  formData: NodeHealthCheckFormData | null;
  formParsingError: string | null;
};
