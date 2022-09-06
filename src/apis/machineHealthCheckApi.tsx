import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { machineHealthCheckKind } from "data/model";
import { MachineHealthCheckKind } from "data/types";

export const useAllMachineHealthChecks = () => {
  return useK8sWatchResource<MachineHealthCheckKind[]>({
    groupVersionKind: machineHealthCheckKind,
    isList: true,
    namespaced: true,
  });
};
