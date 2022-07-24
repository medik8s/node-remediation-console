import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import * as React from "react";
import NodeHealthCheckPage from "./NodeHealthCheckForm";

const NodeHealthCheckCreatePage = () => {
  return (
    <NodeHealthCheckPage
      name=""
      nodeHealthCheck={initialNodeHealthCheckData}
      title={"Create NodeHealthCheck"}
      isCreateFlow={true}
    />
  );
};

export default NodeHealthCheckCreatePage;
