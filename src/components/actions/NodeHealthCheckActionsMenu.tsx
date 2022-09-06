import ActionsMenu from "copiedFromConsole/utils/ActionsMenu";
import { NodeHealthCheck } from "data/types";
import * as React from "react";
import useNodeHealthCheckActions from "./useNodeHealthCheckActions";

const NodeHealthCheckActionsMenu: React.FC<{
  nodeHealthCheck: NodeHealthCheck;
  isKababToggle: boolean;
}> = ({ nodeHealthCheck, isKababToggle }) => {
  const actions = useNodeHealthCheckActions(nodeHealthCheck);

  return (
    <ActionsMenu
      actions={actions}
      isKababToggle={isKababToggle}
      data-test="toggle-menu"
    />
  );
};

export default NodeHealthCheckActionsMenu;
