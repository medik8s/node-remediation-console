import useSnrTemplate from "apis/useSNRTemplate";
import * as React from "react";
import { getNodeHealthCheckApiVersion, nodeHealthCheckKind } from "./model";
import { getEmptyRemediationTemplate } from "./remediator";
import {
  InitialNodeHealthCheck,
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
``;

export const useDefaultNodeHealthCheck = (): [
  InitialNodeHealthCheck | undefined,
  boolean
] => {
  const [snrTemplate, loaded] = useSnrTemplate();
  const defaultNodeHealthCheck = React.useMemo<
    InitialNodeHealthCheck | undefined
  >(() => {
    if (!loaded) {
      return undefined;
    }
    const defaultRemediator = snrTemplate
      ? snrTemplate
      : getEmptyRemediationTemplate();
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
  }, [snrTemplate, loaded]);
  return [defaultNodeHealthCheck, loaded];
};
