import * as React from "react";

import {
  PageComponentProps,
  ResourceYAMLEditor,
} from "@openshift-console/dynamic-plugin-sdk";
import { Bullseye } from "@patternfly/react-core";
import { Loading } from "components/copiedFromConsole/status-box";
import { NodeHealthCheck } from "data/types";

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
