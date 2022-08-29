import { useField } from "formik";
import * as React from "react";
import * as _ from "lodash";
import { NodeKind } from "copiedFromConsole/types/node";
import NodeList from "./NodeList";
import LabelsSelector from "./LabelsSelector";

import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { Alert } from "@patternfly/react-core";
import { useIsSNR } from "../remediatorFieldUtils";
import { getObjectItemFieldName } from "components/shared/formik-utils";
import { getObjectLabelDisplayNames } from "data/nodeSelector";

const SNRWorkerNodesWarning: React.FC<{ formViewFieldName: string }> = ({
  formViewFieldName,
}) => {
  const { t } = useNodeHealthCheckTranslation();
  const isSNR = useIsSNR(formViewFieldName);
  if (isSNR) {
    return (
      <Alert
        variant="info"
        title={t("Note: Self node remediation supports worker nodes only.")}
        isInline
        id="info-inline-alert"
      />
    );
  }
  return null;
};

const NodeSelectionField: React.FC<{
  allNodes: NodeKind[];
  formViewFieldName: string;
}> = ({ allNodes, formViewFieldName }) => {
  const fieldName = getObjectItemFieldName([
    formViewFieldName,
    "nodeSelectorLabels",
  ]);
  const [{ value: labels }] = useField<string[]>(fieldName);
  const [selectedNodes, setSelectedNodes] =
    React.useState<NodeKind[]>(allNodes);
  React.useEffect(() => {
    if (labels.length === 0) {
      setSelectedNodes(allNodes);
      return;
    }
    const nodesWithLabels = allNodes.filter((node: NodeKind) => {
      const nodeLabels = getObjectLabelDisplayNames(node);
      return _.difference(labels, nodeLabels).length === 0;
    });
    setSelectedNodes(nodesWithLabels);
  }, [allNodes, labels]);

  return (
    <>
      <LabelsSelector
        nodes={allNodes}
        formViewFieldName={formViewFieldName}
        fieldName={fieldName}
      ></LabelsSelector>
      <SNRWorkerNodesWarning formViewFieldName={formViewFieldName} />
      <div className="node-selector-list" data-test="node-selector-list">
        <NodeList
          nodes={selectedNodes}
          filteredNodes={selectedNodes}
          loaded={true}
          loadError={null}
        ></NodeList>
      </div>
    </>
  );
};

export default NodeSelectionField;
