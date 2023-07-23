import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { JSONSchema7 } from "json-schema";

export enum K8sResourceConditionStatus {
  True = "True",
  False = "False",
  Unknown = "Unknown",
}
export type K8sResourceCondition = {
  type: string;
  status: keyof typeof K8sResourceConditionStatus;
  lastTransitionTime?: string;
  reason?: string;
  message?: string;
};

export type CRDVersion = {
  name: string;
  served: boolean;
  storage: boolean;
  schema: {
    // NOTE: Actually a subset of JSONSchema, but using this type for convenience
    openAPIV3Schema: JSONSchema7;
  };
};

export type CustomResourceDefinition = {
  spec: {
    group: string;
    versions: CRDVersion[];
    names: {
      kind: string;
      singular: string;
      plural: string;
      listKind: string;
      shortNames?: string[];
    };
    scope: "Cluster" | "Namespaced";
  };
  status?: {
    conditions?: K8sResourceCondition[];
  };
} & K8sResourceCommon;

export type Descriptor<T = unknown> = {
  path: string;
  displayName: string;
  description: string;
  "x-descriptors"?: T[];
  value?: unknown;
};

export type CRDDescription = {
  name: string;
  version: string;
  kind: string;
  displayName: string;
  description?: string;
  specDescriptors?: Descriptor[];
  statusDescriptors?: Descriptor[];
  resources?: {
    name?: string;
    version: string;
    kind: string;
  }[];
};

export type APIServiceDefinition = {
  name: string;
  group: string;
  version: string;
  kind: string;
  deploymentName: string;
  containerPort: number;
  displayName: string;
  description?: string;
  specDescriptors?: Descriptor[];
  statusDescriptors?: Descriptor[];
  resources?: {
    name?: string;
    version: string;
    kind: string;
  }[];
};

// Generic, unknown kind. Avoid when possible since it allows any key in spec
// or status, weakening type checking.
export type K8sResourceKind = K8sResourceCommon & {
  spec?: {
    [key: string]: unknown;
  };
  status?: { [key: string]: unknown };
  data?: { [key: string]: unknown };
};
