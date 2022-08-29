import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { K8sResourceCondition } from "copiedFromConsole/k8s/types";

export type Release = {
  version: string;
  image: string;
  url?: string;
  channels?: string[];
};

export type UpdateHistory = {
  state: "Completed" | "Partial";
  startedTime: string;
  completionTime: string;
  version: string;
  image: string;
  verified: boolean;
};

type ClusterVersionStatus = {
  desired: Release;
  history: UpdateHistory[];
  observedGeneration: number;
  versionHash: string;
  conditions?: ClusterVersionCondition[];
  availableUpdates: Release[];
  conditionalUpdates?: ConditionalUpdate[];
};

export type ConditionalUpdate = {
  release: Release;
  conditions: K8sResourceCondition[];
};

export enum ClusterVersionConditionType {
  Available = "Available",
  Failing = "Failing",
  Progressing = "Progressing",
  RetrievedUpdates = "RetrievedUpdates",
  Invalid = "Invalid",
  Upgradeable = "Upgradeable",
}

export type ClusterVersionCondition = {
  type: keyof typeof ClusterVersionConditionType;
} & K8sResourceCondition;

type ClusterVersionSpec = {
  channel: string;
  clusterID: string;
  desiredUpdate?: Release;
  upstream?: string;
};

export type ClusterVersionKind = {
  spec: ClusterVersionSpec;
  status: ClusterVersionStatus;
} & K8sResourceCommon;
