import {
  ResourceLink,
  RowProps,
  TableColumn,
  TableData,
  VirtualizedTable,
} from "@openshift-console/dynamic-plugin-sdk";
import { NodeKind } from "copiedFromConsole/types/node";
import { nodeKind } from "data/model";
import * as React from "react";
import NodeStatus, { nodeStatus } from "copiedFromConsole/nodes/NodeStatus";
import { sortable, SortByDirection } from "@patternfly/react-table";

import { useField } from "formik";
import { EmptyState, Title } from "@patternfly/react-core";
import { useNodeHealthCheckTranslation } from "localization/useNodeHealthCheckTranslation";
import { getNodeRolesText } from "data/nodeRoles";
import useSelectedNodes from "apis/useSelectedNodes";

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
        <NodeStatus node={obj} />
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        {getNodeRolesText(obj)}
      </TableData>
    </>
  );
};

const getEmptyMsg = (selectedLabels: string[]) => {
  const component = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { t } = useNodeHealthCheckTranslation();
    return (
      <EmptyState>
        <Title headingLevel="h2" size="lg">
          {selectedLabels.length === 0
            ? t("No nodes were selected, use filter to select nodes")
            : t("No nodes match the selected labels")}
        </Title>
      </EmptyState>
    );
  };
  return component;
};

const NodeList = ({ fieldName }: { fieldName: string }) => {
  const [{ value }] = useField<string[]>(fieldName);
  const [selectedNodes, loaded, error] = useSelectedNodes(value);
  return (
    <VirtualizedTable<NodeKind>
      data={selectedNodes || []}
      unfilteredData={selectedNodes || []}
      loaded={loaded}
      loadError={error}
      columns={columns}
      Row={NodeRow}
      EmptyMsg={getEmptyMsg(value)}
    />
  );
};

export default NodeList;
