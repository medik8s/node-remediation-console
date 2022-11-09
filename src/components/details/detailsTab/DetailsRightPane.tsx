import { DetailsItem } from "copiedFromConsole/utils/details-item";
import { nodeHealthCheckKind } from "data/model";
import { getRemediatorLabel } from "data/remediator";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

import { usePropertyDescriptions } from "propertyDescriptions/usePropertyDescriptions";
import * as React from "react";
import NodeHealthCheckStatus from "../NodeHealthCheckStatus";

export const DetailsRightPane: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
}> = ({ nodeHealthCheck }) => {
  const { t } = useNodeHealthCheckTranslation();
  const descriptions = usePropertyDescriptions();
  return (
    <dl className="co-m-pane__details">
      <DetailsItem
        label={t("Remediator")}
        obj={nodeHealthCheck}
        resourceKind={nodeHealthCheckKind.kind}
      >
        {getRemediatorLabel(nodeHealthCheck)}
      </DetailsItem>
      <DetailsItem
        label={t("Min healthy")}
        obj={nodeHealthCheck}
        path="spec.minHealthy"
        description={descriptions.minHealthy}
        resourceKind={nodeHealthCheckKind.kind}
      ></DetailsItem>

      <DetailsItem
        label={t("Observed nodes")}
        obj={nodeHealthCheck}
        resourceKind={nodeHealthCheckKind.kind}
      >
        {nodeHealthCheck.status?.observedNodes}
      </DetailsItem>

      <DetailsItem
        label={t("Healthy nodes")}
        obj={nodeHealthCheck}
        resourceKind={nodeHealthCheckKind.kind}
      >
        {nodeHealthCheck.status?.healthyNodes}
      </DetailsItem>

      <DetailsItem
        label={t("Status")}
        obj={nodeHealthCheck}
        resourceKind={nodeHealthCheckKind.kind}
      >
        <NodeHealthCheckStatus
          nodeHealthCheck={nodeHealthCheck}
          withPopover={true}
        />
      </DetailsItem>
    </dl>
  );
};
