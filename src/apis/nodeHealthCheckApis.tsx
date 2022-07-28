import { k8sDelete, k8sUpdate } from "@openshift-console/dynamic-plugin-sdk";
import { K8sResourceKind } from "components/copiedFromConsole/k8s/types";
import { NodeHealthCheckModel } from "data/model";
import { NodeHealthCheck } from "data/types";
import * as _ from "lodash";
import * as React from "react";
import { useAllMachineHealthChecks } from "./useMachineHealthCheckApi";

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

const isTerminatingMachineHealthCheck = (
  machineHealthCheck: K8sResourceKind
) => {
  return (
    machineHealthCheck.spec.unhealthyConditions &&
    machineHealthCheck.spec.unhealthyConditions.length === 1 &&
    machineHealthCheck.spec.unhealthyConditions[0].type === "Terminating"
  );
};

export const useNodeHealthChecksDisabled = () => {
  const [machineHealthChecks, loaded, error] = useAllMachineHealthChecks();
  const isDisabled = React.useMemo(() => {
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
  }, [machineHealthChecks, loaded, error]);
  React.useEffect(() => {
    console.log(machineHealthChecks);
  }, [machineHealthChecks]);
  return [isDisabled, loaded, error];
};
