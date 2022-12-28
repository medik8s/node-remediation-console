import {
  k8sList,
  ResourceLink,
  RowProps,
  TableColumn,
  TableData,
  useK8sModel,
  VirtualizedTable,
} from "@openshift-console/dynamic-plugin-sdk";
import { getNodeRolesText } from "copiedFromConsole/selectors/node";
import { NodeKind } from "copiedFromConsole/types/node";
import { nodeKind } from "data/model";
import * as React from "react";
import NodeStatus from "copiedFromConsole/nodes/NodeStatus";
import { sortable, SortByDirection } from "@patternfly/react-table";
import { nodeStatus } from "copiedFromConsole/nodes/node";
import { useField } from "formik";
import { selectorFromStringArray } from "copiedFromConsole/module/selector";
import { useDeepCompareMemoize } from "copiedFromConsole/hooks/deep-compare-memoize";
import { EmptyState, Title } from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";

const sortByStatus = (nodes: NodeKind[], sortDirection: SortByDirection) => {
  return nodes.sort((node1: NodeKind, node2: NodeKind) => {
    const status1 = nodeStatus(node1);
    const status2 = nodeStatus(node2);
    return sortDirection === SortByDirection.asc
      ? status1.localeCompare(status2)
      : status2.localeCompare(status1);
  });
};

const sortByRole = (nodes: NodeKind[], sortDirection: SortByDirection) => {
  return nodes.sort((node1: NodeKind, node2: NodeKind) => {
    const role1 = getNodeRolesText(node1);
    const role2 = getNodeRolesText(node2);
    return sortDirection === SortByDirection.asc
      ? role1.localeCompare(role2)
      : role2.localeCompare(role1);
  });
};

const columns: TableColumn<NodeKind>[] = [
  {
    title: "Name",
    id: "name",
    sort: "metadata.name",
    transforms: [sortable],
  },
  {
    title: "Status",
    id: "status",
    sort: sortByStatus,
    transforms: [sortable],
  },
  {
    title: "Role",
    id: "role",
    sort: sortByRole,
    transforms: [sortable],
  },
];

const NodeRow: React.FC<RowProps<NodeKind>> = ({ obj, activeColumnIDs }) => {
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={nodeKind}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        <NodeStatus node={obj}></NodeStatus>
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {getNodeRolesText(obj)}
      </TableData>
    </>
  );
};

const EmptyMsg = () => {
  const { t } = useNodeHealthCheckTranslation();
  return (
    <EmptyState>
      <Title headingLevel="h2" size="lg">
        {t("No nodes match the selected labels")}
      </Title>
    </EmptyState>
  );
};

const NodeList: React.FC<{
  allNodes: NodeKind[];
  fieldName: string;
  allNodesLoaded: boolean;
}> = ({ allNodes, fieldName, allNodesLoaded }) => {
  const [{ value }] = useField<string[]>(fieldName);
  const [nodeModel, modelLoading] = useK8sModel(nodeKind);
  const [selectedNodes, setSelectedNodes] = React.useState<NodeKind[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<unknown>();
  const memoValue = useDeepCompareMemoize<string[]>(value);
  React.useEffect(() => {
    if (!memoValue || !allNodesLoaded || !nodeModel) {
      return;
    }
    if (memoValue.length === 0) {
      setLoading(false);
      setSelectedNodes(allNodes);
      return;
    }
    setLoadError(undefined);
    setLoading(true);
    k8sList({
      model: nodeModel,
      queryParams: { labelSelector: selectorFromStringArray(memoValue) },
    })
      .then((nodeList) => {
        setLoading(false);
        setSelectedNodes(nodeList as NodeKind[]);
      })
      .catch((err) => {
        setLoadError(err);
        setLoading(false);
      });
  }, [memoValue, allNodesLoaded, nodeModel]); // doesn't respond to allNodes, it changes every second
  return (
    <VirtualizedTable<NodeKind>
      data={selectedNodes}
      unfilteredData={selectedNodes}
      loaded={!modelLoading && !loading && allNodesLoaded}
      loadError={loadError}
      columns={columns}
      Row={NodeRow}
      EmptyMsg={EmptyMsg}
    />
  );
};

export default NodeList;
