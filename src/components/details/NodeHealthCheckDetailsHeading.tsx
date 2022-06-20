import useNodeHealthCheckActions from "components/actions/useNodeHealthCheckActions";
import { PageHeading } from "components/copiedFromConsole/utils/headings";
import { NodeHealthCheckModel } from "data/model";
import { getName, getPhase } from "data/selectors";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { useNodeHealthCheckNavigation } from "navigation/useNodeHealthCheckNavigation";
import * as React from "react";
import { getIcon } from "./NodeHealthCheckStatus";

const NodeHealthCheckDetailsHeading: React.FC<{
  nodeHealthCheck;
}> = ({ nodeHealthCheck }) => {
  const actions = useNodeHealthCheckActions(nodeHealthCheck);
  const { t } = useNodeHealthCheckTranslation();
  const navigation = useNodeHealthCheckNavigation();
  return (
    <PageHeading
      breadcrumbs={[
        {
          name: t("NodeHealthChecks"),
          path: navigation.getNodeHealthCheckUrl(),
        },
        {
          name: nodeHealthCheck.metadata.name,
          path: navigation.getNodeHealthCheckUrl(getName(nodeHealthCheck)),
        },
      ]}
      title={getName(nodeHealthCheck)}
      menuActions={actions}
      statusIcon={getIcon(getPhase(nodeHealthCheck))}
      statusText={getPhase(nodeHealthCheck)}
      abbr={NodeHealthCheckModel.abbr}
      kind={NodeHealthCheckModel.kind}
      detail={true}
    />
  );
};

export default NodeHealthCheckDetailsHeading;
