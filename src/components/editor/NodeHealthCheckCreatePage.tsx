import { LoadingBox } from "copiedFromConsole/utils/status-box";
import { useDefaultNodeHealthCheck } from "data/defaults";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import NodeHealthCheckForm from "./NodeHealthCheckForm";

const NodeHealthCheckCreatePage = () => {
  const { t } = useNodeHealthCheckTranslation();
  const [defaultNodeHealthCheck, loaded] = useDefaultNodeHealthCheck();

  return loaded ? (
    <NodeHealthCheckForm
      name=""
      nodeHealthCheck={defaultNodeHealthCheck}
      title={t("Create NodeHealthCheck")}
      isCreateFlow={true}
    />
  ) : (
    <LoadingBox />
  );
};

export default NodeHealthCheckCreatePage;
