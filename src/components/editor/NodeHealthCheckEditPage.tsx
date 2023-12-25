import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { StatusBox } from "copiedFromConsole/utils/status-box";
import { nodeHealthCheckKind } from "data/model";
import { NodeHealthCheck } from "data/types";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import { Helmet } from "react-helmet";
import NodeHealthCheckForm from "./NodeHealthCheckForm";
import { useLocation } from "react-router";
import { withFallback } from "../../copiedFromConsole/error";

const getNHCNameFromUrl = (url: string) => {
  const pathSegments = url.split("/");
  const name = pathSegments[pathSegments.length - 2];
  if (name) {
    return name;
  } else {
    throw new Error(`URL ${url} doesn't contain the NodeHealthCheck name`);
  }
};

const NodeHealthCheckEditPage_ = () => {
  const location = useLocation();
  const name = getNHCNameFromUrl(location.pathname);
  const { t } = useNodeHealthCheckTranslation();
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
const NodeHealthCheckEditPage = withFallback(NodeHealthCheckEditPage_);

export default NodeHealthCheckEditPage;
