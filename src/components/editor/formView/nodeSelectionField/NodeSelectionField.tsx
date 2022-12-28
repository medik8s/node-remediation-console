import { useField } from "formik";
import * as React from "react";

import { NodeKind } from "copiedFromConsole/types/node";
import NodeList from "./NodeList";

import MultiSelectField from "components/shared/MultiSelectField";
import { uniq, flatten } from "lodash";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import useDeepCompareMemoize from "hooks/useDeepCompareMemoize";
import { nodeKind } from "data/model";
import { useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk";
import { LoadError } from "copiedFromConsole/utils/status-box";

const stringifyNodeLabels = (node: NodeKind): string[] => {
  if (!node.metadata?.labels) {
    return [];
  }
  return Object.entries(node.metadata.labels).map(([key, value]) =>
    value ? `${key}=${value}` : key
  );
};

const NodeSelectionField: React.FC<{
  fieldName: string;
}> = ({ fieldName }) => {
  const { t } = useNodeHealthCheckTranslation();
  const [{ value }] = useField<string[]>(fieldName);
  const [options, setOptions] = React.useState<string[]>();
  const [allNodes, loaded, loadError] = useK8sWatchResource<NodeKind[]>({
    groupVersionKind: nodeKind,
    isList: true,
    namespaced: false,
  });
  const memoValue = useDeepCompareMemoize<string[]>(value);
  React.useEffect(() => {
    const curOptions = options || [];
    if (loaded && !loadError) {
      let _options = uniq(
        flatten(allNodes.map((node) => stringifyNodeLabels(node)))
      );
      //add value to options, needed for complex match expressions or labels that aren't currently on the nodes
      //include previous options to not remove original match expressions
      _options = uniq([...memoValue, ...curOptions, ..._options]).sort();
      setOptions(_options);
    }
  }, [memoValue, loaded, loadError]); // doesn't respond to allNodes, it changes every second
  if (loadError) {
    return (
      <LoadError
        message={loadError.message || t("Failed to fetch nodes")}
        label={t("nodes")}
      />
    );
  }
  return (
    <>
      <MultiSelectField
        options={options || []}
        enableClear={true}
        isLoading={!loaded || !options}
        name={fieldName}
        label={t("Nodes selection")}
        helpText={t(
          "Use labels to select the nodes you want to remediate. Leaving this field empty will select all nodes of the cluster."
        )}
      ></MultiSelectField>
      <div className="nhc-form-node-list" data-test="node-selector-list">
        <NodeList
          allNodes={allNodes}
          fieldName={fieldName}
          allNodesLoaded={loaded}
        />
      </div>
    </>
  );
};

export default NodeSelectionField;
