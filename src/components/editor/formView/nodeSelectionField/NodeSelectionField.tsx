import * as React from "react";

import { NodeKind } from "copiedFromConsole/types/node";
import NodeList from "./NodeList";

import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { nodeKind } from "data/model";
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { LoadError } from "copiedFromConsole/utils/status-box";
import LabelSelectionField from "./LabelSelectionField";
import { FormSection } from "@patternfly/react-core";

const NodeSelectionField: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const { t } = useNodeHealthCheckTranslation();
  const [allNodes, loaded, loadError] = useK8sWatchResource<NodeKind[]>({
    groupVersionKind: nodeKind,
    isList: true,
    namespaced: false,
  });
  if (loadError) {
    return (
      <LoadError
        message={loadError.message || t("Failed to fetch nodes")}
        label={t("nodes")}
      />
    );
  }
  return (
    <FormSection title={t("Selector")}>
      <LabelSelectionField
        isLoading={!loaded}
        allNodes={allNodes}
        fieldName={fieldName}
      />
      <div className="nhc-form-node-list" data-test="node-selector-list">
        <NodeList fieldName={fieldName} />
      </div>
    </FormSection>
  );
};

export default NodeSelectionField;
