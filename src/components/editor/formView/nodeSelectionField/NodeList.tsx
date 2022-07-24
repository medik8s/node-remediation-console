import {
  ResourceLink,
  RowProps,
  TableColumn,
  TableData,
  VirtualizedTable,
} from "@openshift-console/dynamic-plugin-sdk";
import { getNodeRolesText } from "components/copiedFromConsole/selectors/node";
import { NodeKind } from "components/copiedFromConsole/types/node";
import { nodeKind } from "data/model";
import * as React from "react";
import NodeStatus from "components/copiedFromConsole/nodes/NodeStatus";
import { sortable, SortByDirection } from "@patternfly/react-table";
import { nodeStatus } from "components/copiedFromConsole/nodes/node";

const sortByStatus = (nodes: NodeKind[], sortDirection: SortByDirection) => {
  return nodes.sort((node1: NodeKind, node2: NodeKind) => {
    const status1 = nodeStatus(node1);
    const status2 = nodeStatus(node2);
    if (status1 === status2) {
      return 0;
    }
    if (status1 > status2 && sortDirection === SortByDirection.asc) {
      return 1;
    }
    return -1;
  });
};

const sortByRole = (nodes: NodeKind[], sortDirection: SortByDirection) => {
  return nodes.sort((node1: NodeKind, node2: NodeKind) => {
    const role1 = getNodeRolesText(node1);
    const role2 = getNodeRolesText(node2);
    if (role1 === role2) {
      return 0;
    }
    if (role1 > role2 && sortDirection === SortByDirection.asc) {
      return 1;
    }
    return -1;
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
