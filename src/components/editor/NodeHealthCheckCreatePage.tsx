import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import * as React from "react";
import NodeHealthCheckForm from "./NodeHealthCheckForm";

const NodeHealthCheckCreatePage = () => {
  return (
    <NodeHealthCheckForm
      name=""
      nodeHealthCheck={initialNodeHealthCheckData}
      title={"Create NodeHealthCheck"}
      isCreateFlow={true}
    />
  );
};

export default NodeHealthCheckCreatePage;
