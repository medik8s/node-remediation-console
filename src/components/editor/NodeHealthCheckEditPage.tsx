import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { StatusBox } from "copiedFromConsole/utils/status-box";
import { nodeHealthCheckKind } from "data/model";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import { Helmet } from "react-helmet";
import { RouteComponentProps } from "react-router";
import NodeHealthCheckForm from "./NodeHealthCheckForm";

export type NodeHealthCheckEditPageProps = RouteComponentProps<{
  name: string;
}>;

const NodeHealthCheckEditPage: React.FC<NodeHealthCheckEditPageProps> = ({
  match,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const { name } = match.params;
  const [nodeHealthCheck, loaded, loadError] =
    useK8sWatchResource<NodeHealthCheck>({
      groupVersionKind: nodeHealthCheckKind,
      name,
    });
  const title = t("Edit NodeHealthCheck");
  const nodeHealthCheckForm = (
    <NodeHealthCheckForm
      name={name}
      nodeHealthCheck={nodeHealthCheck}
      title={title}
      isCreateFlow={false}
    />
  );

  return (
    <StatusBox loaded={loaded} loadError={loadError} data={nodeHealthCheck}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {nodeHealthCheckForm}
    </StatusBox>
  );
};

export default NodeHealthCheckEditPage;
