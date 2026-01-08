import * as React from "react";
import { getNodeHealthCheckApiVersion, nodeHealthCheckKind } from "./model";
import { getDefaultRemediator } from "./remediator";
import {
  InitialNodeHealthCheck,
  RemediationTemplate,
  UnhealthyConditions,
  UnhealthyConditionStatus,
} from "./types";

export const DEFAULT_MIN_HEALTHY = "51%";

export const defaultUnhealthyConditions: UnhealthyConditions = [
  {
    duration: "300s",
    status: UnhealthyConditionStatus.False,
    type: "Ready",
  },
  {
    duration: "300s",
    status: UnhealthyConditionStatus.Unknown,
    type: "Ready",
  },
];

export const useDefaultNodeHealthCheck = (): [
  InitialNodeHealthCheck | undefined,
  boolean
] => {
  const defaultNodeHealthCheck = React.useMemo<
    InitialNodeHealthCheck | undefined
  >(() => {
    const defaultRemediator: RemediationTemplate =
      getDefaultRemediator().template;
    return {
      apiVersion: getNodeHealthCheckApiVersion(),
      kind: nodeHealthCheckKind.kind,
      metadata: {
        name: "",
      },
      spec: {
        remediationTemplate: defaultRemediator,
        unhealthyConditions: defaultUnhealthyConditions,
        minHealthy: DEFAULT_MIN_HEALTHY,
        selector: {},
      },
    };
  }, []);
  return [defaultNodeHealthCheck, true];
};
