// returns true if machine health checks will class with node health checks
// the following apply to
// 1. no MHC exists: NHC enabled
// multiple MHC exist: NHC disabled
// 1 MHC exists:
// a) if its spec has 1 unhealthyCondition, and its type is "Terminating", NHC is enabled
// b) otherwise NHC is disabled

import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { K8sResourceKind } from "copiedFromConsole/k8s/types";
import { machineHealthCheckKind } from "data/model";

export const useAllMachineHealthChecks = () => {
  return useK8sWatchResource<K8sResourceKind[]>({
    groupVersionKind: machineHealthCheckKind,
    isList: true,
    namespaced: true,
  });
};
