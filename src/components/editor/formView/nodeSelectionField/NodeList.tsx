import {
  ResourceLink,
  RowProps,
  TableColumn,
  TableData,
  VirtualizedTable,
} from "@openshift-console/dynamic-plugin-sdk";
import { getNodeRolesText } from "copiedFromConsole/selectors/node";
import { NodeKind } from "copiedFromConsole/types/node";
import { nodeKind } from "data/model";
import * as React from "react";
import NodeStatus from "copiedFromConsole/nodes/NodeStatus";
import { sortable, SortByDirection } from "@patternfly/react-table";
import { nodeStatus } from "copiedFromConsole/nodes/node";

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

type NodeListProps = {
  nodes: NodeKind[];
  filteredNodes: NodeKind[];
  loaded: boolean;
  loadError: any;
};

const NodeList: React.FC<NodeListProps> = ({
  nodes,
  filteredNodes,
  loaded,
  loadError,
}) => {
  return (
    <VirtualizedTable<NodeKind>
      data={nodes}
      unfilteredData={filteredNodes}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={NodeRow}
    />
  );
};

export default NodeList;
