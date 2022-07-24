import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import * as _ from "lodash";
import { NodeHealthCheck, NodeSelector, UnhealthyCondition } from "./types";

export const getName = <A extends K8sResourceCommon = K8sResourceCommon>(
  value: A
) => _.get(value, "metadata.name") as K8sResourceCommon["metadata"]["name"];

export const getPauseRequests = (nhc: NodeHealthCheck): string[] =>
  nhc.spec?.pauseRequests || [];

export const getPhase = (nhc: NodeHealthCheck) => nhc.status?.phase;

export const getUnhealthyConditions = (
  nhc: NodeHealthCheck
): UnhealthyCondition[] => nhc.spec?.unhealthyConditions || [];

export const getSelector = (nhc: NodeHealthCheck): NodeSelector => {
  return nhc.spec?.selector || {};
};
