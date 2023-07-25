import {
  K8sResourceCommon,
  ObjectMetadata,
  Selector,
} from "@openshift-console/dynamic-plugin-sdk";
import { EditorType } from "../copiedFromConsole/synced-editor/editor-toggle";

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
  escalatingRemediators?: EscalatingRemediator[];
};

export type BasicResourceInfo = {
  apiVersion: string;
  kind: string;
  metadata: ObjectMetadata;
};

export type InitialNodeHealthCheck = {
  spec: Omit<
    Required<NodeHealthCheckSpec>,
    "pauseRequests" | "escalatingRemediators"
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

export enum RemediatorRadioOption {
  SNR = "snr",
  CUSTOM = "custom",
}

export type Remediator = {
  radioOption: RemediatorRadioOption;
  template: RemediationTemplate;
  timeout?: string;
  order?: number;
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
  escalatingRemediators?: Remediator[];
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
export type MachineHealthCondition = {
  type: string;
  status: string;
  timeout: string;
};

export type MachineHealthCheckKind = K8sResourceCommon & {
  spec: {
    selector: Selector;
    unhealthyConditions: MachineHealthCondition[];
  };
};

export type SelfNodeRemediationTemplate = K8sResourceCommon & {
  spec?: {
    template?: {
      spec?: {
        remediationStrategy: string;
      };
    };
  };
};

export type SnrTemplateResult = [RemediationTemplate | undefined, boolean];
