import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

export type NodeCondition = {
  lastHeartbeatTime: string;
  lastTransitionTime: string;
  message: string;
  reason: string;
  status: string;
  type: string;
};

export type NodeAddress = {
  type: string;
  address: string;
};

export type TaintEffect = "" | "NoSchedule" | "PreferNoSchedule" | "NoExecute";

export type Taint = {
  key: string;
  value: string;
  effect: TaintEffect;
};

export type NodeKind = {
  spec: {
    taints?: Taint[];
    unschedulable?: boolean;
  };
  status?: {
    capacity?: {
      [key: string]: string;
    };
    conditions?: NodeCondition[];
    images?: {
      names: string[];
      sizeBytes?: number;
    }[];
    phase?: string;
    nodeInfo?: {
      operatingSystem: string;
    };
  };
} & K8sResourceCommon;
