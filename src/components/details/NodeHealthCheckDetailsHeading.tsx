import useNodeHealthCheckActions from "components/actions/useNodeHealthCheckActions";
import { PageHeading } from "copiedFromConsole/utils/headings";
import { NodeHealthCheckModel } from "data/model";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import * as React from "react";
import { getIcon } from "./NodeHealthCheckStatus";

const NodeHealthCheckDetailsHeading: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
}> = ({ nodeHealthCheck }) => {
  const actions = useNodeHealthCheckActions(nodeHealthCheck);
  const { t } = useNodeHealthCheckTranslation();
  const navigation = useNodeHealthCheckNavigation();
  const phase = nodeHealthCheck.status?.phase;
  return (
    <PageHeading
      breadcrumbs={[
        {
          name: t("NodeHealthChecks"),
          path: navigation.getNodeHealthCheckUrl(),
        },
        {
          name: nodeHealthCheck.metadata.name,
          path: navigation.getNodeHealthCheckUrl(
            nodeHealthCheck.metadata?.name
          ),
        },
      ]}
      title={nodeHealthCheck.metadata?.name}
      menuActions={actions}
      statusIcon={getIcon(phase)}
      statusText={phase}
      kind={NodeHealthCheckModel.kind}
      detail={true}
    />
  );
};

export default NodeHealthCheckDetailsHeading;
