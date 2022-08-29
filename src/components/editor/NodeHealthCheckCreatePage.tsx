import { defaultNodeHealthCheck } from "data/defaults";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import * as React from "react";
import NodeHealthCheckForm from "./NodeHealthCheckForm";

const NodeHealthCheckCreatePage = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <NodeHealthCheckForm
      name=""
      nodeHealthCheck={defaultNodeHealthCheck}
      title={t("Create NodeHealthCheck")}
      isCreateFlow={true}
    />
  );
};

export default NodeHealthCheckCreatePage;
