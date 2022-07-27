import { k8sDelete, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";
import { NodeHealthCheckModel } from "data/model";
import { NodeHealthCheck } from "data/types";
import * as _ from "lodash";

export const updateNodeHealthCheck = (
  nodeHealthCheck: NodeHealthCheck
): Promise<NodeHealthCheck> => {
  const newNodeHealthCheck: NodeHealthCheck = _.omit(nodeHealthCheck, "status");
  return k8sUpdate({
    model: NodeHealthCheckModel,
    data: newNodeHealthCheck,
  });
};

export const editNodeHealthCheckPauseReasons = (
  nodeHealthCheck: NodeHealthCheck,
  pauseReasons: string[]
): Promise<NodeHealthCheck> => {
  const newNodeHealthCheck: NodeHealthCheck = {
    ...nodeHealthCheck,
    spec: {
      ...nodeHealthCheck.spec,
      pauseRequests: pauseReasons,
    },
  };
  return updateNodeHealthCheck(newNodeHealthCheck);
};

export const unpauseNodeHealthCheck = (
  nodeHealthCheck: NodeHealthCheck
): Promise<NodeHealthCheck> => {
  const newNodeHealthCheck: NodeHealthCheck = {
    ...nodeHealthCheck,
  };
  if (newNodeHealthCheck.spec) {
    newNodeHealthCheck.spec.pauseRequests = undefined;
  }
  return updateNodeHealthCheck(newNodeHealthCheck);
};

export const deleteNodeHealthCheck = (
  nodeHealthCheck: NodeHealthCheck
): Promise<NodeHealthCheck> => {
  return k8sDelete({
    model: NodeHealthCheckModel,
    resource: nodeHealthCheck,
  });
};

export const updateNodeHealthCheckLabels = (
  nodeHealthCheck: NodeHealthCheck,
  labels: { [key: string]: string }
) => {
  const newNodeHealthCheck: NodeHealthCheck = {
    ...nodeHealthCheck,
    metadata: {
      ...nodeHealthCheck.metadata,
      labels,
    },
  };
  return updateNodeHealthCheck(newNodeHealthCheck);
};

export const updateNodeHealthCheckAnnotations = (
  nodeHealthCheck: NodeHealthCheck,
  annotations: { [key: string]: string }
) => {
  const newNodeHealthCheck: NodeHealthCheck = {
    ...nodeHealthCheck,
    metadata: {
      annotations,
    },
  };
  return updateNodeHealthCheck(newNodeHealthCheck);
};
