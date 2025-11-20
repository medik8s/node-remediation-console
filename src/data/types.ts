import {
  ObjectMetadata,
  Selector,
} from "@openshift-console/dynamic-plugin-sdk";

export enum EditorType {
  Form = "form",
  YAML = "yaml",
}

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

export interface OperatorInfo {
  name: string;
  isInstalled: boolean;
}

export type EscalatingRemediator = {
  remediationTemplate: RemediationTemplate;
  order?: number;
  timeout?: string;
};

export type UnhealthyConditions = UnhealthyCondition[];

export type NodeHealthCheckSpec = {
  selector?: Selector;
  remediationTemplate?: RemediationTemplate;
  minHealthy?: string | number;
  unhealthyConditions?: UnhealthyConditions;
  pauseRequests?: string[];
  escalatingRemediations?: EscalatingRemediator[];
};

export type BasicResourceInfo = {
  apiVersion: string;
  kind: string;
  metadata: ObjectMetadata;
};

export type InitialNodeHealthCheck = {
  spec: Omit<
    Required<NodeHealthCheckSpec>,
    "pauseRequests" | "escalatingRemediations"
  >;
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

export type Remediator = {
  template: RemediationTemplate;
  timeout?: string;
  order: number | "";
  id: number;
};

export enum RemediatorMode {
  SINGLE = "single",
  MULTIPLE = "multiple",
}

export type FormViewValues = {
  name: string;
  nodeSelector: string[];
  minHealthy: string;
  unhealthyConditions: UnhealthyCondition[];
  remediator?: Remediator;
  escalatingRemediations?: Remediator[];
  useEscalating: boolean;
};

export type NodeHealthCheckFormValues = {
  isCreateFlow: boolean;
  editorType: EditorType;
  yamlData: string;
  formData: FormViewValues | null;
  formParsingError: string | null;
  resourceVersion: string;
  reloadCount: number;
};
