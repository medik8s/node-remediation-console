import * as React from "react";
import {
  VirtualizedTable,
  TableData,
  RowProps,
  ResourceLink,
  TableColumn,
  Timestamp,
  //Timestamp,
} from "@openshift-console/dynamic-plugin-sdk";

import { nodeHealthCheckKind, NodeHealthCheckModel } from "data/model";
import { NodeHealthCheck } from "data/types";
import "./list.css";
import NodeHealthCheckStatus from "../details/NodeHealthCheckStatus";
import NotAvailable from "./NotAvailable";
//import { initialNodeHealthCheckData } from "data/initialNodeHealthCheckData";
import NodeHealthCheckActionsMenu from "components/actions/NodeHealthCheckActionsMenu";
import { sortable, SortByDirection } from "@patternfly/react-table";
import { getRemediatorLabel } from "data/remediator";
import { EmptyBox } from "copiedFromConsole/utils/status-box";

const sortByRemediator = (
  nodeHealthChecks: NodeHealthCheck[],
  sortDirection: SortByDirection
) => {
  return nodeHealthChecks.sort(
    (nodeHealthCheck1: NodeHealthCheck, nodeHealthCheck2: NodeHealthCheck) => {
      const remediator1 = getRemediatorLabel(nodeHealthCheck1);
      const remediator2 = getRemediatorLabel(nodeHealthCheck2);
      if (remediator1 === remediator2) {
        return 0;
      }
      if (remediator1 > remediator2 && sortDirection === SortByDirection.asc) {
        return 1;
      }
      return -1;
    }
  );
};

const columns: TableColumn<NodeHealthCheck>[] = [
  {
    title: "Name",
    id: "name",
    sort: "metadata.name",
    transforms: [sortable],
  },
  {
    title: "Status",
    id: "status",
    sort: "status.phase",
    transforms: [sortable],
  },
  {
    title: "Remediator",
    id: "remediator",
    sort: sortByRemediator,
    transforms: [sortable],
  },
  {
    title: "Created",
    id: "created",
    sort: "metadata.creationTimestamp",
    transforms: [sortable],
  },
  { title: "", id: "kabab-menu" },
];

const Remediator = ({ obj }: { obj: NodeHealthCheck }) => {
  const remediatorLabel = getRemediatorLabel(obj);
  if (!remediatorLabel) {
    return <NotAvailable />;
  }
  return <>{remediatorLabel}</>;
};

const NodeHealthcheckRow: React.FC<RowProps<NodeHealthCheck>> = ({
  obj,
  activeColumnIDs,
}) => {
  return (
    <>
      <TableData id={columns[0].id} activeColumnIDs={activeColumnIDs}>
        <ResourceLink
          groupVersionKind={nodeHealthCheckKind}
          name={obj.metadata.name}
          namespace={obj.metadata.namespace}
        />
      </TableData>
      <TableData id={columns[3].id} activeColumnIDs={activeColumnIDs}>
        <NodeHealthCheckStatus nodeHealthCheck={obj} withPopover={true} />
      </TableData>
      <TableData id={columns[2].id} activeColumnIDs={activeColumnIDs}>
        <Remediator obj={obj} />
      </TableData>
      <TableData id={columns[1].id} activeColumnIDs={activeColumnIDs}>
        <Timestamp timestamp={obj.metadata.creationTimestamp} />
      </TableData>
      <TableData id={columns[4].id} activeColumnIDs={activeColumnIDs}>
        <NodeHealthCheckActionsMenu
          nodeHealthCheck={obj}
          isKababToggle={true}
        ></NodeHealthCheckActionsMenu>
      </TableData>
    </>
  );
};

type NodeHealthchecksTableProps = {
  data: NodeHealthCheck[];
  unfilteredData: NodeHealthCheck[];
  loaded: boolean;
  loadError: any;
};

const EmptyNodeHealthChecks: React.FC = () => {
  return <EmptyBox label={NodeHealthCheckModel.labelPlural}></EmptyBox>;
};

export const NodeHealthchecksTable: React.FC<NodeHealthchecksTableProps> = ({
  data,
  unfilteredData,
  loaded,
  loadError,
}) => {
  return (
    <VirtualizedTable<NodeHealthCheck>
      data={data}
      unfilteredData={unfilteredData}
      loaded={loaded}
      loadError={loadError}
      columns={columns}
      Row={NodeHealthcheckRow}
      EmptyMsg={EmptyNodeHealthChecks}
    />
  );
};
