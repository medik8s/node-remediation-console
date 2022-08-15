import * as React from "react";
import * as _ from "lodash";

import { NodeKind } from "../types/node";
import Status from "../status/Status";
import { Condition } from "../console-app/queries";
import { getNodeSecondaryStatus, nodeStatus } from "./node";
import NodeUnschedulableStatus from "./NodeUnschedulableStatus";
import SecondaryStatus from "../status/SecondaryStatus";
import { Button } from "@patternfly/react-core";

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
              {_.startCase(item)}
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
