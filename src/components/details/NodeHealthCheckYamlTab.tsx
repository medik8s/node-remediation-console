import * as React from "react";

import {
  PageComponentProps,
  ResourceYAMLEditor,
} from "@openshift-console/dynamic-plugin-sdk";
import { Bullseye } from "@patternfly/react-core";
import { NodeHealthCheck } from "data/types";
import { Loading } from "copiedFromConsole/utils/status-box";

const NodeHealthCheckYAMLTab: React.FC<PageComponentProps<NodeHealthCheck>> = ({
  obj: nodeHealthCheck,
}) => {
  const loading = (
    <Bullseye>
      <Loading />
    </Bullseye>
  );
  return !nodeHealthCheck ? (
    loading
  ) : (
    <React.Suspense fallback={loading}>
      <ResourceYAMLEditor initialResource={nodeHealthCheck} />
    </React.Suspense>
  );
};

export default NodeHealthCheckYAMLTab;
