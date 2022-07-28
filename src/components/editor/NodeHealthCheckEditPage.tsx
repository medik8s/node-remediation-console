import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { LoadingBox } from "components/copiedFromConsole/status-box";
import ErrorState from "components/shared/ErrorState";
import { nodeHealthCheckKind } from "data/model";
import { NodeHealthCheck } from "data/types";
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
  const { name } = match.params;
  const [nodeHealthCheck, loaded, loadError] =
    useK8sWatchResource<NodeHealthCheck>({
      groupVersionKind: nodeHealthCheckKind,
      name,
    });
  const title = "Edit NodeHealthCheck";
  if (!loaded) {
    return <LoadingBox />;
  }
  if (loadError) {
    return <ErrorState />;
  }
  const nodeHealthCheckForm = (
    <NodeHealthCheckForm
      name={name}
      nodeHealthCheck={nodeHealthCheck}
      title={title}
      isCreateFlow={false}
    />
  );

  //TODO: use status box
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {nodeHealthCheckForm}
    </>
  );
};

export default NodeHealthCheckEditPage;
