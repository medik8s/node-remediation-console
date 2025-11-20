import { DetailsItem } from "copiedFromConsole/utils/details-item";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

import * as React from "react";
import NodeHealthCheckStatus from "../NodeHealthCheckStatus";
import { DescriptionList } from "@patternfly/react-core";
import { RemediationTemplateLink } from "../../shared/RemediationTemplateLink";

export const DetailsRightPane: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
}> = ({ nodeHealthCheck }) => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <DescriptionList aria-label={t("NodeHealthCheck summary")}>
      <DetailsItem label={t("Remediator")} obj={nodeHealthCheck}>
        <RemediationTemplateLink nodeHealthCheck={nodeHealthCheck} t={t} />
      </DetailsItem>
      <DetailsItem
        label={t("Min healthy")}
        obj={nodeHealthCheck}
        path="spec.minHealthy"
      />

      <DetailsItem label={t("Observed nodes")} obj={nodeHealthCheck}>
        {nodeHealthCheck.status?.observedNodes}
      </DetailsItem>

      <DetailsItem label={t("Healthy nodes")} obj={nodeHealthCheck}>
        {nodeHealthCheck.status?.healthyNodes}
      </DetailsItem>

      <DetailsItem label={t("Status")} obj={nodeHealthCheck}>
        <NodeHealthCheckStatus
          nodeHealthCheck={nodeHealthCheck}
          withPopover={true}
        />
      </DetailsItem>
    </DescriptionList>
  );
};
