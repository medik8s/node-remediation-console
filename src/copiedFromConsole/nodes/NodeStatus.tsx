import * as React from "react";

import { NodeCondition, NodeKind } from "../types/node";
import Status from "../status/Status";
import { Condition } from "../console-app/queries";
import NodeUnschedulableStatus from "./NodeUnschedulableStatus";
import SecondaryStatus from "../status/SecondaryStatus";
import { Button } from "@patternfly/react-core";
import { startCase, get, find } from "lodash-es";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

const isNodeUnschedulable = (node: NodeKind): boolean =>
  get(node, "spec.unschedulable", false);

const isNodeReady = (node: NodeKind): boolean => {
  const conditions = get(node, "status.conditions", []);
  const readyState = find(conditions, { type: "Ready" }) as NodeCondition;

  return readyState && readyState.status === "True";
};

export const nodeStatus = (node: NodeKind) =>
  isNodeReady(node) ? "Ready" : "Not Ready";

const getNodeSecondaryStatus = (node: NodeKind): string[] => {
  const { t } = useNodeHealthCheckTranslation();
  const states = [];
  if (isNodeUnschedulable(node)) {
    states.push(t("Scheduling disabled"));
  }
  return states;
};

const isMonitoredCondition = (condition: Condition): boolean =>
  [
    Condition.DISK_PRESSURE,
    Condition.MEM_PRESSURE,
    Condition.PID_PRESSURE,
  ].includes(condition);

const getDegradedStates = (node: NodeKind): Condition[] => {
  return node.status.conditions
    .filter(
      ({ status, type }) =>
        status === "True" && isMonitoredCondition(type as Condition)
    )
    .map(({ type }) => type as Condition);
};

const NodeStatus: React.FC<NodeStatusProps> = ({
  node,
  showPopovers = false,
  className,
}) => {
  const status = showPopovers ? getDegradedStates(node) : [];
  return (
    <>
      {!node.spec.unschedulable ? (
        <Status status={nodeStatus(node)} className={className} />
      ) : (
        <NodeUnschedulableStatus
          status={nodeStatus(node)}
          className={className}
        />
      )}
      <SecondaryStatus status={getNodeSecondaryStatus(node)} />
      {status.length > 0 &&
        status.map((item) => (
          <div key={item}>
            <Button variant="link" isInline>
              {startCase(item)}
            </Button>
          </div>
        ))}
    </>
  );
};

type NodeStatusProps = {
  node: NodeKind;
  showPopovers?: boolean;
  className?: string;
};

export default NodeStatus;
