import { DetailsItem } from "components/copiedFromConsole/utils/details-item";
import { nodeHealthCheckKind } from "data/model";
import { getNodeHealthCheckRemediatorLabel } from "data/remediatorFormData";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as _ from "lodash";
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
        {getNodeHealthCheckRemediatorLabel(nodeHealthCheck)}
      </DetailsItem>
      <DetailsItem
        label={t("Min Healthy")}
        obj={nodeHealthCheck}
        path="spec.minHealthy"
        description={descriptions.minHealthy}
        resourceKind={nodeHealthCheckKind.kind}
      ></DetailsItem>

      <DetailsItem
        label={t("Observed nodes")}
        obj={nodeHealthCheck}
        path="status.observedNodes"
        description={descriptions.observedNodes}
        resourceKind={nodeHealthCheckKind.kind}
      ></DetailsItem>

      <DetailsItem
        label={t("Healthy nodes")}
        obj={nodeHealthCheck}
        path="status.healthyNodes"
        description={descriptions.healthyNodes}
        resourceKind={nodeHealthCheckKind.kind}
      ></DetailsItem>

      <DetailsItem
        label={t("Status")}
        obj={nodeHealthCheck}
        resourceKind={nodeHealthCheckKind.kind}
        path="status.phase"
      >
        <NodeHealthCheckStatus
          nodeHealthCheck={nodeHealthCheck}
          withPopover={true}
        />
      </DetailsItem>
    </dl>
  );
};
