import { Selector } from "@openshift-console/dynamic-plugin-sdk";
import * as _ from "lodash";
import { NodeHealthCheck, StatusPhase, UnhealthyCondition } from "./types";

export const getName = (nodeHealthCheck: NodeHealthCheck) =>
  nodeHealthCheck?.metadata.name;

export const getPauseRequests = (nodeHealthCheck: NodeHealthCheck): string[] =>
  nodeHealthCheck.spec?.pauseRequests || [];

export const getPhase = (nodeHealthCheck: NodeHealthCheck) =>
  nodeHealthCheck.status?.phase;

export const getUnhealthyConditions = (
  nodeHealthCheck: NodeHealthCheck
): UnhealthyCondition[] => nodeHealthCheck.spec?.unhealthyConditions || [];

export const getSelector = (nodeHealthCheck: NodeHealthCheck): Selector => {
  return nodeHealthCheck.spec?.selector || {};
};

export const isDisabled = (nodeHealthCheck: NodeHealthCheck) => {
  return getPhase(nodeHealthCheck) === StatusPhase.DISABLED;
};
