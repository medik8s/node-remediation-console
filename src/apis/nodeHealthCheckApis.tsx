import { k8sDelete, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";
import { NodeHealthCheckModel } from "data/model";
import { MachineHealthCheckKind, NodeHealthCheck } from "data/types";
import { useAllMachineHealthChecks } from "./machineHealthCheckApi";
import { omit } from "lodash-es";
export const updateNodeHealthCheck = (
  nodeHealthCheck: NodeHealthCheck
): Promise<NodeHealthCheck> => {
  const newNodeHealthCheck: NodeHealthCheck = omit(nodeHealthCheck, "status");
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
      ...nodeHealthCheck.metadata,
      annotations,
    },
  };
  return updateNodeHealthCheck(newNodeHealthCheck);
};

// returns true if machine health checks will clash with node health checks
// in case of a class all generated NodeHealthChecks become disabled, so it's more user friendly to warn the user ahead
// The clashing occurs if one of the following options is met
// 1. Multiple MachineHealthCheck exist
// 2. There's one Machine Health Check and it has more than one unhealthy condition, or one unhealthy condition with a type different than "Terminating"
const isTerminatingMachineHealthCheck = (
  machineHealthCheck: MachineHealthCheckKind
) => {
  return (
    machineHealthCheck.spec.unhealthyConditions &&
    machineHealthCheck.spec.unhealthyConditions.length === 1 &&
    machineHealthCheck.spec.unhealthyConditions[0].type === "Terminating"
  );
};

export const useNodeHealthChecksDisabled = () => {
  const [machineHealthChecks, loaded, error] = useAllMachineHealthChecks();
  const isDisabled = () => {
    if (!machineHealthChecks || !loaded || error) {
      return false;
    }
    if (machineHealthChecks.length > 1) {
      return true;
    }
    if (machineHealthChecks.length === 1) {
      return !isTerminatingMachineHealthCheck(machineHealthChecks[0]);
    }
    return false;
  };
  return [isDisabled(), loaded, error];
};
