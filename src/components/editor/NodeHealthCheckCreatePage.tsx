import { defaultNodeHealthCheck } from "data/defaults";
import * as React from "react";
import NodeHealthCheckForm from "./NodeHealthCheckForm";

const NodeHealthCheckCreatePage = () => {
  return (
    <NodeHealthCheckForm
      name=""
      nodeHealthCheck={defaultNodeHealthCheck}
      title={"Create NodeHealthCheck"}
      isCreateFlow={true}
    />
  );
};

export default NodeHealthCheckCreatePage;
