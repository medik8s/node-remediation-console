// returns true if machine health checks will class with node health checks
// the following apply to
// 1. no MHC exists: NHC enabled
// multiple MHC exist: NHC disabled
// 1 MHC exists:
// a) if its spec has 1 unhealthyCondition, and its type is "Terminating", NHC is enabled
// b) otherwise NHC is disabled

import {
  //ResourcesObject,
  useK8sWatchResource,
  // useK8sWatchResources,
  // WatchK8sResource,
  // WatchK8sResources,
  // WatchK8sResults,
} from "@openshift-console/dynamic-plugin-sdk";
import { K8sResourceKind } from "components/copiedFromConsole/k8s/types";
//import { K8sResourceKind } from "components/copiedFromConsole/k8s/types";
import { machineHealthCheckKind } from "data/model";
// import * as React from "react";
// import { Namespace } from "react-i18next";
// import { useAllNamespaceNames } from "./useNamespaceApis";

// const getMachineHealthCheckWatchResource = (
//   namespaceName: string
// ): WatchK8sResource => ({
//   groupVersionKind: machineHealthCheckKind,
//   namespace: namespaceName,
// });

// interface MachineHealthCheckWatchResources extends ResourcesObject {
//   [namespace: string]: K8sResourceKind;
// }

// export const useAllMachineHealthChecks = () => {
//   const allNamespaceNames = useAllNamespaceNames();
//   const watchResources = React.useMemo<
//     WatchK8sResources<MachineHealthCheckWatchResources>
//   >(() => {
//     const ret: WatchK8sResources<MachineHealthCheckWatchResources> = {};
//     for (const namespaceName of allNamespaceNames) {
//       ret[namespaceName] = {
//         groupVersionKind: machineHealthCheckKind,
//         namespace: namespaceName,
//       };
//     }
//     return ret;
//   }, [allNamespaceNames]);
//   const results =
//     useK8sWatchResources<MachineHealthCheckWatchResources>(watchResources);
//   const isLoading = React.useMemo<boolean>(() => {
//     return !!Object.values(results).find((result) => !result.loaded);
//   }, [results]);
//   const error = React.useMemo<unknown>(() => {
//     return Object.values(results).find((result) => result.loadError);
//   }, [results]);
//   const machineHealthChecks = React.useMemo<K8sResourceCommon[]>(() => {
//     const ret = [];
//     for (const result of Object.values(results)) {
//       ret = [...ret];
//     }
//   }, results);
// };

export const useAllMachineHealthChecks = () => {
  return useK8sWatchResource<K8sResourceKind[]>({
    groupVersionKind: machineHealthCheckKind,
    isList: true,
    namespaced: true,
  });
};
