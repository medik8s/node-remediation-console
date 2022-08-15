import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { isNodeReady, isNodeUnschedulable } from "../selectors/node";
import { NodeKind } from "../types/node";

export const nodeStatus = (node: NodeKind) =>
  isNodeReady(node) ? "Ready" : "Not Ready";

export const getNodeSecondaryStatus = (node: NodeKind): string[] => {
  const { t } = useNodeHealthCheckTranslation();
  const states = [];
  if (isNodeUnschedulable(node)) {
    states.push(t("Scheduling disabled"));
  }
  return states;
};
